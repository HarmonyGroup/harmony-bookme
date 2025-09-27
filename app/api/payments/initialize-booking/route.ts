import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Booking } from "@/models/booking";
import { Payment } from "@/models/payment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/users";
import Configuration from "@/models/configuration";
import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Authentication required. Please log in to continue.",
        },
        { status: 401 }
      );
    }

    if (!session.user.role || !["explorer"].includes(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: "FORBIDDEN",
          message: "Create an explorer account to continue booking.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_INPUT",
          message: "Booking ID is required.",
        },
        { status: 400 }
      );
    }

    // Find the booking
    const booking = await Booking.findById(bookingId).populate('explorer');
    
    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    if (booking.explorer.toString() !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "FORBIDDEN",
          message: "You can only pay for your own bookings.",
        },
        { status: 403 }
      );
    }

    if (booking.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_STATUS",
          message: "This booking is not pending payment.",
        },
        { status: 400 }
      );
    }

    // Get vendor information for split payment
    let vendorId;
    let subaccountId;
    let isSplitPayment = false;
    let commissionRate = 3; // Default fallback

    try {
      // Get vendor ID based on booking type
      if (booking.type === "leisure") {
        const { Leisure } = await import("@/models/leisure");
        const leisure = await Leisure.findById(booking.listing);
        vendorId = leisure?.vendor;
      } else if (booking.type === "events") {
        const { Event } = await import("@/models/event");
        const event = await Event.findById(booking.listing);
        vendorId = event?.organizer;
      } else if (booking.type === "accommodations") {
        const { Accommodation } = await import("@/models/accommodation");
        const accommodation = await Accommodation.findById(booking.listing);
        vendorId = accommodation?.vendor;
      } else if (booking.type === "movies_and_cinema") {
        const Movie = (await import("@/models/movie")).default;
        const movie = await Movie.findById(booking.listing).populate('cinema');
        vendorId = movie?.cinema?.vendor;
      }

      if (vendorId) {
        const vendor = await User.findById(vendorId);
        if (vendor && vendor.paystackSubaccount?.subaccountId && vendor.paystackSubaccount?.status === "active") {
          subaccountId = vendor.paystackSubaccount.subaccountId;
          isSplitPayment = true;

          // Get commission rate
          const config = await Configuration.findOne({ isActive: true });
          if (config) {
            const standardCommissionRate = config.commissionRates[vendor.vendorAccountPreference as keyof typeof config.commissionRates];
            const customRate = vendor.commissionRate;
            commissionRate = customRate !== null && customRate !== undefined ? customRate : (standardCommissionRate || 3);
          }
        }
      }
    } catch (error) {
      console.error("Error getting vendor information:", error);
    }

    // Create payment record
    const payment = new Payment({
      bookingId: booking._id,
      explorer: session.user.id,
      vendor: vendorId,
      amount: booking.totalAmount,
      currency: "NGN",
      status: "pending",
      paymentMethod: "paystack",
      metadata: {
        bookingType: booking.type,
        customerName: `${booking.explorer.firstName} ${booking.explorer.lastName}`,
        commissionRate: commissionRate.toString(),
        isSplitPayment,
        subaccountId,
      },
    });

    await payment.save();

    // Prepare Paystack request
    const paystackRequest: Record<string, unknown> = {
      email: booking.explorer.email,
      amount: booking.totalAmount * 100, // Convert to kobo
      reference: payment.paystackReference,
      metadata: {
        bookingId: booking._id.toString(),
        bookingType: booking.type,
        customerName: `${booking.explorer.firstName} ${booking.explorer.lastName}`,
        commissionRate: commissionRate.toString(),
        custom_fields: [
          {
            display_name: "Booking Type",
            variable_name: "booking_type",
            value: booking.type,
          },
          {
            display_name: "Booking Code",
            variable_name: "booking_code",
            value: booking.code,
          },
        ],
      },
    };

    // Add split payment configuration if applicable
    if (isSplitPayment && subaccountId) {
      paystackRequest.subaccount = subaccountId;
      paystackRequest.bearer = "subaccount"; // Vendor pays Paystack fees
    }

    // Initialize Paystack payment
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      paystackRequest,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status) {
      // Update payment with Paystack reference
      payment.paystackReference = response.data.data.reference;
      payment.paystackAccessCode = response.data.data.access_code;
      await payment.save();

      return NextResponse.json(
        {
          success: true,
          data: {
            authorization_url: response.data.data.authorization_url,
            access_code: response.data.data.access_code,
            reference: response.data.data.reference,
            paymentId: payment._id,
          },
          message: "Payment initialized successfully",
        },
        { status: 200 }
      );
    } else {
      throw new Error(response.data.message || "Failed to initialize payment");
    }
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "PAYMENT_INITIALIZATION_FAILED",
        message: (error as { response?: { data?: { message?: string } } }).response?.data?.message || (error as Error).message || "Failed to initialize payment",
      },
      { status: 500 }
    );
  }
}
