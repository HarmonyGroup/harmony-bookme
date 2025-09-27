import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Payment } from "@/models/payment";
import { Booking } from "@/models/booking";
import { verifyPaystackTransaction } from "@/services/shared/paystack-verification";
import { confirmBookingPayment } from "@/services/shared/confirm-booking-payment";
import crypto from "crypto";

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
    }

    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_SIGNATURE",
          message: "Invalid webhook signature.",
        },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    await connectToDB();

    // Handle different webhook events
    switch (event.event) {
      case "charge.success":
        await handlePaymentSuccess(event.data);
        break;
      case "charge.failed":
        await handlePaymentFailed(event.data);
        break;
      case "transfer.success":
        await handleTransferSuccess(event.data);
        break;
      case "transfer.failed":
        await handleTransferFailed(event.data);
        break;
      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "WEBHOOK_ERROR",
        message: "Failed to process webhook.",
      },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(data: Record<string, unknown>) {
  try {
    // Find payment to get bookingId
    const payment = await Payment.findOne({
      paystackReference: data.reference,
    });

    if (!payment) {
      return;
    }

    // Fetch complete transaction details from Paystack verification API
    let transactionDetails;
    try {
      transactionDetails = await verifyPaystackTransaction(data.reference as string);
    } catch (error: unknown) {
      console.error("Error fetching transaction details from Paystack:", error);
      // Fallback to webhook data if verification fails
      transactionDetails = { data };
    }

    // Use the confirmBookingPayment service
    try {
      // Ensure we have the correct structure for confirmBookingPayment
      const paystackData = transactionDetails.data || data;
      await confirmBookingPayment({
        bookingId: payment.bookingId.toString(),
        paystackData: {
          id: paystackData.id as number,
          status: paystackData.status as string,
          reference: paystackData.reference as string,
          paid_at: paystackData.paid_at as string,
          fees_split: paystackData.fees_split,
          gateway_response: paystackData.gateway_response as string,
          channel: paystackData.channel as string,
          fees_breakdown: paystackData.fees_breakdown,
        },
      });
      
    } catch (error: unknown) {
      console.error("Error confirming booking payment from webhook:", error);
      // Don't throw error - webhook should still return success
    }

  } catch (error: unknown) {
    console.error("Error handling payment success:", error);
  }
}

async function handlePaymentFailed(data: Record<string, unknown>) {
  try {
    const payment = await Payment.findOne({
      paystackReference: data.reference,
    });

    if (!payment) {
      return;
    }

    // Update payment status
    payment.status = "failed";
    payment.metadata = {
      ...payment.metadata,
      paystackTransactionId: data.id,
      paystackStatus: data.status,
      paystackGatewayResponse: data.gateway_response,
      paystackChannel: data.channel,
      failureReason: data.failure_reason,
      webhookProcessedAt: new Date(),
    };

    await payment.save();

    // Update booking status
    const booking = await Booking.findById(payment.bookingId);
    if (booking) {
      booking.paymentStatus = "failed";
      booking.paymentReference = data.reference;
      await booking.save();
    }

  } catch (error: unknown) {
    console.error("Error handling payment failure:", error);
  }
}

async function handleTransferSuccess(data: Record<string, unknown>) {
  // Handle successful transfers to vendors (if applicable)
  console.log(`Transfer successful: ${data.reference}`);
}

async function handleTransferFailed(data: Record<string, unknown>) {
  // Handle failed transfers to vendors (if applicable)
  console.log(`Transfer failed: ${data.reference}`);
}
