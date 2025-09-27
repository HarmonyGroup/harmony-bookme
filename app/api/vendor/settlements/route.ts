import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import Settlement from "@/models/settlement";
// import { Payment } from "@/models/payment";
import { GetSettlementsResponse } from "@/types/settlement";

export async function GET(request: NextRequest) {
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
        { success: false, message: "Only vendors can access settlements" },
        { status: 403 }
      );
    }

    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as "pending" | "success" | "failed" | "cancelled" | null;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build filter query
    const filter: Record<string, unknown> = { vendor: session.user.id };
    
    if (status) {
      filter.status = status;
    }
    
    if (startDate || endDate) {
      filter.settlementDate = {};
      const settlementDateFilter = filter.settlementDate as Record<string, unknown>;
      if (startDate) {
        settlementDateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        settlementDateFilter.$lte = new Date(endDate);
      }
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        settlements: settlements as any,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      },
    } as GetSettlementsResponse);

  } catch (error: unknown) {
    console.error("Get settlements error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
