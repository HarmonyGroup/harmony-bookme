import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/users";
import { connectToDB } from "@/lib/mongoose";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

interface VerifyBankRequest {
  accountNumber: string;
  bankCode: string;
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
        { success: false, message: "Only vendors can verify bank details" },
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

    const body: VerifyBankRequest = await request.json();
    const { accountNumber, bankCode } = body;

    // Validate required fields
    if (!accountNumber || !bankCode) {
      return NextResponse.json(
        { success: false, message: "Account number and bank code are required" },
        { status: 400 }
      );
    }

    // Verify bank account with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error("Paystack bank verification failed:", paystackData);
      return NextResponse.json(
        { 
          success: false, 
          message: paystackData.message || "Bank verification failed",
          details: paystackData
        },
        { status: 400 }
      );
    }

    // Update user's bank details if verification is successful
    if (paystackData.status && paystackData.data) {
      user.bankDetails = {
        accountNumber: accountNumber,
        bankCode: bankCode,
        accountName: paystackData.data.account_name,
        bankName: paystackData.data.bank_name,
      };

      // Update last verified timestamp if subaccount exists
      if (user.paystackSubaccount) {
        user.paystackSubaccount.lastVerifiedAt = new Date();
        user.paystackSubaccount.updatedAt = new Date();
      }

      await user.save();

      return NextResponse.json({
        success: true,
        message: "Bank details verified successfully",
        data: {
          accountNumber: paystackData.data.account_number,
          accountName: paystackData.data.account_name,
          bankCode: paystackData.data.bank_code,
          bankName: paystackData.data.bank_name,
          verified: true,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "Bank verification failed" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Bank verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
