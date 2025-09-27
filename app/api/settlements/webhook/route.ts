import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Settlement, { type ISettlement } from "@/models/settlement";
import { Payment } from "@/models/payment";
import User from "@/models/users";
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

    // Handle different settlement webhook events
    switch (event.event) {
      case "settlement.success":
        await handleSettlementSuccess(event.data);
        break;
      case "settlement.failed":
        await handleSettlementFailed(event.data);
        break;
      case "transfer.success":
        await handleTransferSuccess(event.data);
        break;
      case "transfer.failed":
        await handleTransferFailed(event.data);
        break;
      default:
        console.log(`Unhandled settlement webhook event: ${event.event}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Settlement webhook processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "WEBHOOK_ERROR",
        message: "Failed to process settlement webhook.",
      },
      { status: 500 }
    );
  }
}

async function handleSettlementSuccess(data: Record<string, unknown>) {
  try {
    console.log("Processing settlement success:", data);

    // Check if settlement already exists
    let settlement = await Settlement.findOne({ settlementId: data.id });
    
    if (settlement) {
      // Update existing settlement
      settlement.status = "success";
      settlement.settlementDate = new Date(data.settlement_date as string);
      settlement.paystackData = {
        settlementId: data.id,
        amount: data.amount,
        status: data.status,
        settlementDate: data.settlement_date,
        settlementBank: data.settlement_bank,
        settlementAccount: data.settlement_account,
        settlementSchedule: data.settlement_schedule,
      };
      await settlement.save();
    } else {
      // Create new settlement
      // Find vendor by subaccount if provided
      let vendorId = null;
      if (data.subaccount) {
        const vendor = await User.findOne({ 
          "paystackSubaccount.subaccountId": data.subaccount 
        });
        vendorId = vendor?._id;
      }

      if (!vendorId) {
        console.error("Vendor not found for settlement:", data);
        return;
      }

      settlement = new Settlement({
        settlementId: data.id,
        vendor: vendorId,
        amount: data.amount,
        currency: "NGN",
        status: "success",
        settlementDate: new Date(data.settlement_date as string),
        settlementBank: data.settlement_bank,
        settlementAccount: data.settlement_account,
        paystackData: {
          settlementId: data.id,
          amount: data.amount,
          status: data.status,
          settlementDate: data.settlement_date,
          settlementBank: data.settlement_bank,
          settlementAccount: data.settlement_account,
          settlementSchedule: data.settlement_schedule,
        },
        payments: [],
      });

      await settlement.save();
    }

    // Link pending payments to this settlement
    await linkPaymentsToSettlement(settlement);

    console.log(`Settlement successful: ${data.id}`);
  } catch (error) {
    console.error("Error handling settlement success:", error);
  }
}

async function handleSettlementFailed(data: Record<string, unknown>) {
  try {
    console.log("Processing settlement failed:", data);

    // Check if settlement already exists
    let settlement = await Settlement.findOne({ settlementId: data.id });
    
    if (settlement) {
      settlement.status = "failed";
      await settlement.save();
    } else {
      // Create failed settlement record
      let vendorId = null;
      if (data.subaccount) {
        const vendor = await User.findOne({ 
          "paystackSubaccount.subaccountId": data.subaccount 
        });
        vendorId = vendor?._id;
      }

      if (!vendorId) {
        console.error("Vendor not found for failed settlement:", data);
        return;
      }

      settlement = new Settlement({
        settlementId: data.id,
        vendor: vendorId,
        amount: data.amount,
        currency: "NGN",
        status: "failed",
        settlementDate: new Date(data.settlement_date as string),
        settlementBank: data.settlement_bank,
        settlementAccount: data.settlement_account,
        paystackData: {
          settlementId: data.id,
          amount: data.amount,
          status: data.status,
          settlementDate: data.settlement_date,
          settlementBank: data.settlement_bank,
          settlementAccount: data.settlement_account,
          settlementSchedule: data.settlement_schedule,
        },
        payments: [],
      });

      await settlement.save();
    }

    // Update payment settlement status to failed
    await Payment.updateMany(
      { 
        vendor: settlement.vendor,
        settlementStatus: "pending",
        status: "success"
      },
      { 
        settlementStatus: "failed",
        settlementId: data.id
      }
    );

    console.log(`Settlement failed: ${data.id}`);
  } catch (error) {
    console.error("Error handling settlement failure:", error);
  }
}

async function handleTransferSuccess(data: Record<string, unknown>) {
  console.log(`Transfer successful: ${data.reference}`);
  // Handle successful transfers if needed
}

async function handleTransferFailed(data: Record<string, unknown>) {
  console.log(`Transfer failed: ${data.reference}`);
  // Handle failed transfers if needed
}

async function linkPaymentsToSettlement(settlement: ISettlement) {
  try {
    // Find all pending payments for this vendor
    const pendingPayments = await Payment.find({
      vendor: settlement.vendor,
      settlementStatus: "pending",
      status: "success",
      settlementId: { $exists: false }
    });

    if (pendingPayments.length > 0) {
      // Update payments with settlement info
      await Payment.updateMany(
        { _id: { $in: pendingPayments.map(p => p._id) } },
        { 
          settlementId: settlement.settlementId,
          settlementStatus: "settled"
        }
      );

      // Add payment IDs to settlement
      settlement.payments = pendingPayments.map(p => p._id);
      await settlement.save();

      console.log(`Linked ${pendingPayments.length} payments to settlement ${settlement.settlementId}`);
    }
  } catch (error) {
    console.error("Error linking payments to settlement:", error);
  }
}
