import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/users";
import Configuration from "@/models/configuration";
import { connectToDB } from "@/lib/mongoose";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

interface CreateSubaccountRequest {
  bankDetails: {
    accountNumber: string;
    bankCode: string;
    accountName: string;
    bankName?: string;
  };
  settlementBank: string;
}

export async function POST(request: NextRequest) {
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
        { success: false, message: "Only vendors can create subaccounts" },
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

    // Check if subaccount already exists
    if (user.paystackSubaccount?.subaccountId) {
      return NextResponse.json(
        { success: false, message: "Subaccount already exists" },
        { status: 400 }
      );
    }

    const body: CreateSubaccountRequest = await request.json();
    const { bankDetails, settlementBank } = body;

    // Validate required fields
    if (!bankDetails?.accountNumber || !bankDetails?.bankCode || !bankDetails?.accountName) {
      return NextResponse.json(
        { success: false, message: "Bank details are required" },
        { status: 400 }
      );
    }

    if (!settlementBank) {
      return NextResponse.json(
        { success: false, message: "Settlement bank is required" },
        { status: 400 }
      );
    }

    // Get commission rates from configuration
    const config = await Configuration.findOne({ isActive: true });
    if (!config) {
      return NextResponse.json(
        { success: false, message: "Commission configuration not found" },
        { status: 500 }
      );
    }

    // Get the appropriate commission rate based on vendor's account preference
    const commissionRate = config.commissionRates[user.vendorAccountPreference as keyof typeof config.commissionRates];
    if (commissionRate === undefined) {
      return NextResponse.json(
        { success: false, message: "Invalid vendor account preference" },
        { status: 400 }
      );
    }

    // Use custom rate if vendor has one, otherwise use standard commission rate
    const customRate = user.commissionRate;
    const finalCommissionRate = customRate !== null && customRate !== undefined ? customRate : commissionRate;

    // Create subaccount with Paystack
    const paystackResponse = await fetch("https://api.paystack.co/subaccount", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_name: bankDetails.accountName, // Use verified account name, not business name
        settlement_bank: settlementBank,
        account_number: bankDetails.accountNumber,
        percentage_charge: finalCommissionRate,
        primary_contact_email: user.email,
        primary_contact_name: `${user.firstName} ${user.lastName}`,
        primary_contact_phone: user.phone,
        metadata: {
          user_id: user._id.toString(),
          business_type: "vendor",
          business_name: user.businessName, // Store actual business name in metadata
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error("Paystack subaccount creation failed:", paystackData);
      return NextResponse.json(
        { 
          success: false, 
          message: paystackData.message || "Failed to create subaccount",
          details: paystackData
        },
        { status: 400 }
      );
    }

    // Update user with subaccount details
    user.bankDetails = {
      accountNumber: bankDetails.accountNumber,
      bankCode: bankDetails.bankCode,
      accountName: bankDetails.accountName,
      bankName: bankDetails.bankName,
    };

    user.paystackSubaccount = {
      subaccountId: paystackData.data.subaccount_code,
      status: paystackData.data.active ? "active" : "pending",
      settlementBank: settlementBank,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Subaccount created successfully",
      data: {
        subaccountId: paystackData.data.subaccount_code,
        status: paystackData.data.active ? "active" : "pending",
        businessName: paystackData.data.business_name,
        commissionRate: finalCommissionRate,
      },
    });

  } catch (error) {
    console.error("Subaccount creation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
