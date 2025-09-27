import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import Settlement from "@/models/settlement";
import { Payment } from "@/models/payment";
import { SettlementStatsResponse } from "@/types/settlement";

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
        { success: false, message: "Only vendors can access settlement stats" },
        { status: 403 }
      );
    }

    await connectToDB();

    const vendorId = session.user.id;

    // Get settlement statistics
    const [
      totalSettlements,
      pendingSettlements,
      successfulSettlements,
      failedSettlements,
      totalAmount,
      pendingAmount,
      successfulAmount,
      failedAmount
    ] = await Promise.all([
      Settlement.countDocuments({ vendor: vendorId }),
      Settlement.countDocuments({ vendor: vendorId, status: "pending" }),
      Settlement.countDocuments({ vendor: vendorId, status: "success" }),
      Settlement.countDocuments({ vendor: vendorId, status: "failed" }),
      Settlement.aggregate([
        { $match: { vendor: vendorId } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Settlement.aggregate([
        { $match: { vendor: vendorId, status: "pending" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Settlement.aggregate([
        { $match: { vendor: vendorId, status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Settlement.aggregate([
        { $match: { vendor: vendorId, status: "failed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    // Get pending payments (not yet settled)
    const pendingPayments = await Payment.aggregate([
      { 
        $match: { 
          vendor: vendorId, 
          status: "success",
          settlementStatus: "pending"
        } 
      },
      { 
        $group: { 
          _id: null, 
          count: { $sum: 1 },
          total: { $sum: "$vendorAmount" }
        } 
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalSettlements,
        totalAmount: totalAmount[0]?.total || 0,
        pendingSettlements,
        pendingAmount: pendingAmount[0]?.total || 0,
        successfulSettlements,
        successfulAmount: successfulAmount[0]?.total || 0,
        failedSettlements,
        failedAmount: failedAmount[0]?.total || 0,
        pendingPaymentsCount: pendingPayments[0]?.count || 0,
        pendingPaymentsAmount: pendingPayments[0]?.total || 0,
      },
    } as SettlementStatsResponse);

  } catch (error: unknown) {
    console.error("Get settlement stats error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
