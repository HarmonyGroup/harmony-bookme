import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Payment } from "@/models/payment";
import {
  verifyPaystackTransaction,
} from "@/services/shared/paystack-verification";
import { confirmBookingPayment } from "@/services/shared/confirm-booking-payment";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "PAYSTACK_CONFIG_ERROR",
          message: "Paystack configuration is missing.",
        },
        { status: 500 }
      );
    };

    const body = await request.json();
    const { reference } = body;
    
    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_INPUT",
          message: "Payment reference is required.",
        },
        { status: 400 }
      );
    };

    await connectToDB();
    
    // Verify payment with Paystack
    const paystackData = await verifyPaystackTransaction(reference);
    
    // Check if payment was successful
    if (paystackData?.status === true && paystackData?.data?.status === "success") {
      // Find payment in database to get bookingId
      const payment = await Payment.findOne({ paystackReference: reference });
      
      if (payment) {
        try {
          // Use the confirmBookingPayment service
          const result = await confirmBookingPayment({
            bookingId: payment.bookingId.toString(),
            paystackData: paystackData.data,
          });
          
          console.log("Booking payment confirmed successfully:", result);
        } catch {
          console.error("Error confirming booking payment");
          // Don't throw error - let the verification response still return success
          // The payment was verified by Paystack, even if our confirmation failed
        }
      } else {
        console.log("Payment not found in database for reference:", reference);
      }
    }
    
    return NextResponse.json(paystackData, { status: 200 });

  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_INPUT",
          message: "Payment reference is required.",
        },
        { status: 400 }
      );
    }

    // This endpoint can be used for webhook verification
    // For now, we'll just return the payment status
    await connectToDB();
    const payment = await Payment.findOne({ paystackReference: reference });

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          error: "PAYMENT_NOT_FOUND",
          message: "Payment record not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          paymentId: payment._id,
          bookingId: payment.bookingId,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          paidAt: payment.paidAt,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Payment status check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
