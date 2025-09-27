import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/users";
import { connectToDB } from "@/lib/mongoose";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET() {
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
        { success: false, message: "Only vendors can check subaccount status" },
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
      return NextResponse.json({
        success: true,
        data: {
          hasSubaccount: false,
          message: "No subaccount found. Please create one first.",
        },
      });
    }

    // Fetch latest status from Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/subaccount/${user.paystackSubaccount.subaccountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error("Paystack subaccount fetch failed:", paystackData);
      // Return local data if Paystack fetch fails
      return NextResponse.json({
        success: true,
        data: {
          hasSubaccount: true,
          subaccountId: user.paystackSubaccount.subaccountId,
          status: user.paystackSubaccount.status,
          businessName: user.businessName,
          settlementBank: user.paystackSubaccount.settlementBank,
          bankDetails: user.bankDetails,
          lastVerifiedAt: user.paystackSubaccount.lastVerifiedAt,
          createdAt: user.paystackSubaccount.createdAt,
          updatedAt: user.paystackSubaccount.updatedAt,
          isLocalData: true,
        },
      });
    }

    // Update local status if it differs from Paystack
    const paystackStatus = paystackData.data.active ? "active" : "inactive";
    if (user.paystackSubaccount.status !== paystackStatus) {
      user.paystackSubaccount.status = paystackStatus;
      user.paystackSubaccount.updatedAt = new Date();
      await user.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        hasSubaccount: true,
        subaccountId: user.paystackSubaccount.subaccountId,
        status: user.paystackSubaccount.status,
        businessName: user.businessName,
        settlementBank: user.paystackSubaccount.settlementBank,
        bankDetails: user.bankDetails,
        lastVerifiedAt: user.paystackSubaccount.lastVerifiedAt,
        createdAt: user.paystackSubaccount.createdAt,
        updatedAt: user.paystackSubaccount.updatedAt,
        paystackData: {
          active: paystackData.data.active,
          is_verified: paystackData.data.is_verified,
          settlement_schedule: paystackData.data.settlement_schedule,
        },
      },
    });

  } catch (error) {
    console.error("Subaccount status check error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
