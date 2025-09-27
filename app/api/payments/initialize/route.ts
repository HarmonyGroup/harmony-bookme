import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Payment } from "@/models/payment";
import { Booking } from "@/models/booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreatePaymentRequest } from "@/types/payment";
import Movie from "@/models/movie";
import { Event } from "@/models/event";
import { Accommodation } from "@/models/accommodation";
import { Leisure } from "@/models/leisure";
import User from "@/models/users";
import Configuration from "@/models/configuration";
// Removed hardcoded fee calculations - let Paystack handle fees

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

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

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "PAYSTACK_CONFIG_ERROR",
          message: "Paystack configuration is missing.",
        },
        { status: 500 }
      );
    }

    await connectToDB();
    const body: CreatePaymentRequest = await request.json();

    // Validate required fields
    if (!body.bookingId || !body.amount || !body.email || !body.customerName) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_INPUT",
          message: "Missing required payment information.",
        },
        { status: 400 }
      );
    }

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(body.bookingId).populate('listing');
    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: "BOOKING_NOT_FOUND",
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

    // Get vendor ID from the listing
    let vendorId;
    if (booking.type === "leisure") {
      // const { Leisure } = await import("@/models/leisure");
      const leisure = await Leisure.findById(booking.listing);
      vendorId = leisure?.vendor;
    } else if (booking.type === "events") {
      // const { Event } = await import("@/models/event");
      const event = await Event.findById(booking.listing);
      vendorId = event?.vendor;
    } else if (booking.type === "accommodations") {
      // const { Accommodation } = await import("@/models/accommodation");
      const accommodation = await Accommodation.findById(booking.listing);
      vendorId = accommodation?.vendor;
    } else if (booking.type === "movies_and_cinema") {
      // const { Movie } = await import("@/models/movie");
      const movie = await Movie.findById(booking.listing).populate('cinema');
      vendorId = movie?.cinema?.vendor;
    }

    if (!vendorId) {
      return NextResponse.json(
        {
          success: false,
          error: "VENDOR_NOT_FOUND",
          message: "Could not determine vendor for this booking.",
        },
        { status: 400 }
      );
    }

    // Get vendor details and check subaccount status
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return NextResponse.json(
        {
          success: false,
          error: "VENDOR_NOT_FOUND",
          message: "Vendor not found.",
        },
        { status: 404 }
      );
    }

    // Check if vendor has an active subaccount for split payments
    let subaccountId = null;
    if (vendor.paystackSubaccount?.subaccountId && vendor.paystackSubaccount?.status === "active") {
      // Verify subaccount exists and is active with Paystack
      try {
        const subaccountResponse = await fetch(
          `${PAYSTACK_BASE_URL}/subaccount/${vendor.paystackSubaccount.subaccountId}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
          }
        );

        if (subaccountResponse.ok) {
          const subaccountData = await subaccountResponse.json();
          if (subaccountData.status && subaccountData.data.active) {
            subaccountId = vendor.paystackSubaccount.subaccountId;
          } else {
            console.log("Subaccount is not active:", subaccountData);
          }
        } else {
          console.log("Failed to verify subaccount:", await subaccountResponse.text());
        }
      } catch (error) {
        console.error("Error verifying subaccount:", error);
      }
    }

    // Store commission rate for tracking (actual amounts will come from Paystack response)
    let commissionRate = 0;
    
    if (subaccountId) {
      // Get commission rate for this vendor (for tracking purposes)
      const config = await Configuration.findOne({ isActive: true });
      if (config) {
        const standardCommissionRate = config.commissionRates[vendor.vendorAccountPreference as keyof typeof config.commissionRates];
        const customRate = vendor.commissionRate;
        commissionRate = customRate !== null && customRate !== undefined ? customRate : (standardCommissionRate || 0);
      }
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ bookingId: body.bookingId });
    if (existingPayment && existingPayment.status === "success") {
      return NextResponse.json(
        {
          success: false,
          error: "PAYMENT_ALREADY_COMPLETED",
          message: "Payment for this booking has already been completed.",
        },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `BOOKME_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare Paystack request
    const paystackRequest: Record<string, unknown> = {
      amount: Math.round(body.amount * 100), // Convert to kobo (smallest currency unit)
      email: body.email,
      reference: reference,
      callback_url: body.callbackUrl || `${process.env.NEXTAUTH_URL}/payment/verify`,
      metadata: {
        bookingId: body.bookingId,
        bookingType: body.bookingType,
        customerName: body.customerName,
        commissionRate: commissionRate,
        custom_fields: [
          {
            display_name: "Booking ID",
            variable_name: "booking_id",
            value: body.bookingId,
          },
          {
            display_name: "Booking Type",
            variable_name: "booking_type",
            value: body.bookingType,
          },
        ],
      },
    };

    // Add subaccount for split payments if vendor has active subaccount
    if (subaccountId) {
      paystackRequest.subaccount = subaccountId;
      // Let Paystack handle fee distribution (default behavior)
    } else {
      console.log("No subaccount available for split payment");
    }

    // Initialize payment with Paystack
    const paystackResponse = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paystackRequest),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      return NextResponse.json(
        {
          success: false,
          error: "PAYSTACK_ERROR",
          message: paystackData.message || "Failed to initialize payment.",
          details: paystackData
        },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = new Payment({
      bookingId: body.bookingId,
      vendor: vendorId,
      explorer: session.user.id,
      paystackReference: reference,
      amount: body.amount, // Amount customer pays
      currency: "NGN",
      status: "pending",
      paymentMethod: "paystack",
      customerEmail: body.email,
      customerName: body.customerName,
      // vendorAmount and platformAmount will be set from Paystack response in webhook
      metadata: {
        bookingType: body.bookingType,
        paystackAccessCode: paystackData.data.access_code,
        subaccountId: subaccountId,
        isSplitPayment: !!subaccountId,
        commissionRate: commissionRate,
        note: "Actual split amounts will be determined by Paystack response",
      },
    });

    await payment.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          authorizationUrl: paystackData.data.authorization_url,
          reference: reference,
          accessCode: paystackData.data.access_code,
          isSplitPayment: !!subaccountId,
          subaccountId: subaccountId,
        },
        message: "Payment initialized successfully.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}


