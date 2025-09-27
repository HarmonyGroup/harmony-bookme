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

    if (!["super_admin", "sub_admin"].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, message: "Only admins can access settlement stats" },
        { status: 403 }
      );
    }

    await connectToDB();

    // Get global settlement statistics
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
      Settlement.countDocuments({}),
      Settlement.countDocuments({ status: "pending" }),
      Settlement.countDocuments({ status: "success" }),
      Settlement.countDocuments({ status: "failed" }),
      Settlement.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Settlement.aggregate([
        { $match: { status: "pending" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Settlement.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Settlement.aggregate([
        { $match: { status: "failed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    // Get platform commission statistics
    const platformStats = await Payment.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalPlatformAmount: { $sum: "$platformAmount" },
          totalVendorAmount: { $sum: "$vendorAmount" }
        }
      }
    ]);

    // Get pending payments (not yet settled)
    const pendingPayments = await Payment.aggregate([
      { 
        $match: { 
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
        platformStats: {
          totalPayments: platformStats[0]?.totalPayments || 0,
          totalAmount: platformStats[0]?.totalAmount || 0,
          totalPlatformAmount: platformStats[0]?.totalPlatformAmount || 0,
          totalVendorAmount: platformStats[0]?.totalVendorAmount || 0,
        }
      },
    } as SettlementStatsResponse);

  } catch (error) {
    console.error("Get admin settlement stats error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
