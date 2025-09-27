import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Booking } from "@/models/booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiError } from "@/types/booking";
import { initializePayment } from "@/services/shared/payment-initialization";
import { Payment } from "@/models/payment";
import { Accommodation } from "@/models/accommodation";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Authentication required. Please log in to continue.",
        },
        { status: 401 }
      );
    }

    if (!session.user.role || !["explorer"].includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "Create an explorer account to continue booking. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "INVALID_INPUT",
          message: "Booking ID is required.",
        },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(bookingId).populate("explorer");

    if (!booking) {
      return NextResponse.json<ApiError>(
        { success: false, error: "NOT_FOUND", message: "Booking not found." },
        { status: 404 }
      );
    }

    let paymentId = null;
    let paymentData = null;
    let vendor = null;

    const accommodation = await Accommodation.findById(booking.listing);
    vendor = accommodation?.vendor;


    const paymentInitData = {
      bookingId: booking._id.toString(),
      amount: booking.totalAmount,
      email: session.user.email,
      customerName: session.user.firstName + " " + session.user.lastName,
      bookingType: booking.type,
    };

    const paymentResult = await initializePayment(paymentInitData);

    if (paymentResult.success) {
      paymentData = paymentResult.data;
      const paymentDoc = new Payment({
        bookingId: booking?._id,
        vendor: vendor,
        explorer: booking?.explorer,
        paystackReference: paymentData?.reference,
        amount: booking.totalAmount,
        currency: "NGN",
        status: "pending",
        paymentMethod: "paystack",
        customerEmail: session.user.email,
        customerName: session.user.firstName + " " + session.user.lastName,
        metadata: {
          bookingType: booking.type,
          isSplitPayment: true,
          paystackAccessCode: paymentData?.access_code,
          paystackAuthorizationUrl: paymentData?.authorization_url,
        },
      });

      try {
        await paymentDoc.save();
        booking.payment = paymentDoc._id;
        await booking.save();

        paymentId = paymentDoc._id.toString();
      } catch (paymentError) {
        console.error("Error saving payment document:", paymentError);
      }
    } else {
      console.error("Payment initialization failed:", paymentResult.error);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          paymentId,
          payment: paymentData,
        },
        message: "Payment initialized successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}