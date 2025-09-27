import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import Settlement from "@/models/settlement";
// import { GetSettlementsResponse } from "@/types/settlement";

export async function GET(request: NextRequest) {
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
        { success: false, message: "Only admins can access all settlements" },
        { status: 403 }
      );
    }

    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as "pending" | "success" | "failed" | "cancelled" | null;
    const vendorId = searchParams.get("vendorId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build filter query
    const filter: Record<string, unknown> = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (vendorId) {
      filter.vendor = vendorId;
    }
    
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.$lte = new Date(endDate);
      }
      filter.settlementDate = dateFilter;
    }

    // Get settlements with pagination
    const settlements = await Settlement.find(filter)
      .populate({
        path: "payments",
        populate: {
          path: "bookingId",
          select: "code type totalAmount details"
        }
      })
      .populate("vendor", "businessName email")
      .sort({ settlementDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Settlement.countDocuments(filter);

    // Calculate total pages
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        settlements: settlements.map(settlement => ({
          settlementId: settlement._id,
          vendor: settlement.vendor,
          amount: settlement.amount,
          currency: settlement.currency,
          status: settlement.status,
          settlementDate: settlement.settlementDate,
          payments: settlement.payments,
          createdAt: settlement.createdAt,
          updatedAt: settlement.updatedAt,
          __v: settlement.__v
        })),
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      },
    });

  } catch (error: unknown) {
    console.error("Get admin settlements error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}