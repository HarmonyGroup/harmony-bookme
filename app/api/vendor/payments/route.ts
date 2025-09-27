import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import { Payment } from "@/models/payment";
import { VendorPaymentsResponse, VendorPaymentsParams } from "@/types/vendor/payment";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as VendorPaymentsParams["status"];
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");

    // Build query
    const query: Record<string, unknown> = {
      vendor: session.user.id,
    };

    // Add status filter
    if (status) {
      query.status = status;
    }

    // Add date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      const createdAtQuery = query.createdAt as Record<string, unknown>;
      if (startDate) {
        createdAtQuery.$gte = new Date(startDate);
      }
      if (endDate) {
        createdAtQuery.$lte = new Date(endDate);
      }
    }

    // Add search filter
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
        { paystackReference: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch payments with populated fields
    const payments = await Payment.find(query)
      .populate({
        path: "bookingId",
        select: "type listing code",
        populate: {
          path: "listing",
          select: "title slug",
        },
      })
      .populate({
        path: "explorer",
        select: "firstName lastName email avatar",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Payment.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const response: VendorPaymentsResponse = {
      success: true,
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payments: payments as any,
        total,
        page,
        limit,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching vendor payments:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
