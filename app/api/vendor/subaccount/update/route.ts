import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/users";
import Configuration from "@/models/configuration";
import { connectToDB } from "@/lib/mongoose";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

interface UpdateSubaccountRequest {
  bankDetails?: {
    accountNumber: string;
    bankCode: string;
    accountName: string;
    bankName?: string;
  };
  settlementBank?: string;
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "vendor") {
      return NextResponse.json(
        { success: false, message: "Only vendors can update subaccounts" },
        { status: 403 }
      );
    }

    await connectToDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if subaccount exists
    if (!user.paystackSubaccount?.subaccountId) {
      return NextResponse.json(
        { success: false, message: "No subaccount found. Please create one first." },
        { status: 400 }
      );
    }

    const body: UpdateSubaccountRequest = await request.json();
    const { bankDetails, settlementBank } = body;

    // Prepare update data for Paystack
    const updateData: Record<string, unknown> = {};

    if (bankDetails) {
      updateData.account_number = bankDetails.accountNumber;
      updateData.bank_code = bankDetails.bankCode;
      updateData.business_name = bankDetails.accountName; // Update business name to verified account name
    }

    if (settlementBank) {
      updateData.settlement_bank = settlementBank;
    }

    // Always update commission rate based on current user settings
    // Get commission rates from configuration
    const config = await Configuration.findOne({ isActive: true });
    if (!config) {
      return NextResponse.json(
        { success: false, message: "Commission configuration not found" },
        { status: 500 }
      );
    }

    // Get the appropriate commission rate based on vendor's account preference
    const standardCommissionRate = config.commissionRates[user.vendorAccountPreference as keyof typeof config.commissionRates];
    if (standardCommissionRate === undefined) {
      return NextResponse.json(
        { success: false, message: "Invalid vendor account preference" },
        { status: 400 }
      );
    }

    // Use custom rate if vendor has one, otherwise use standard commission rate
    const customRate = user.commissionRate;
    const finalCommissionRate = customRate !== null && customRate !== undefined ? customRate : standardCommissionRate;
    
    updateData.percentage_charge = finalCommissionRate;

    // Update subaccount with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/subaccount/${user.paystackSubaccount.subaccountId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error("Paystack subaccount update failed:", paystackData);
      return NextResponse.json(
        { 
          success: false, 
          message: paystackData.message || "Failed to update subaccount",
          details: paystackData
        },
        { status: 400 }
      );
    }

    // Update user data
    if (bankDetails) {
      user.bankDetails = {
        accountNumber: bankDetails.accountNumber,
        bankCode: bankDetails.bankCode,
        accountName: bankDetails.accountName,
        bankName: bankDetails.bankName,
      };
    }

    if (user.paystackSubaccount) {
      if (settlementBank) {
        user.paystackSubaccount.settlementBank = settlementBank;
      }
      user.paystackSubaccount.updatedAt = new Date();
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Subaccount updated successfully",
      data: {
        subaccountId: user.paystackSubaccount.subaccountId,
        status: user.paystackSubaccount.status,
        businessName: user.businessName,
      },
    });

  } catch (error) {
    console.error("Subaccount update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
