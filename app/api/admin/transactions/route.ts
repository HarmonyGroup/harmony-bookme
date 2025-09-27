import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import { Payment } from "@/models/payment";
import { Booking } from "@/models/booking";
import User from "@/models/users";
import { AdminTransactionsResponse, AdminTransactionsParams, AdminPayment } from "@/types/admin/transactions";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin (super_admin or sub_admin)
    if (!["super_admin", "sub_admin"].includes(session.user.role)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "You don't have permission to view all transactions. Only administrators can access this resource." 
        },
        { status: 403 }
      );
    }

    await connectToDB();
    
    // Ensure models are registered
    void Payment;
    void Booking;
    void User;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as AdminTransactionsParams["status"];
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");
    const vendorId = searchParams.get("vendorId");
    const explorerId = searchParams.get("explorerId");

    // Build query
    const query: Record<string, unknown> = {};

    // Add status filter
    if (status) {
      query.status = status;
    }

    // Add date range filter
    if (startDate || endDate) {
      query.createdAt = {} as Record<string, Date>;
      if (startDate) {
        (query.createdAt as Record<string, Date>).$gte = new Date(startDate);
      }
      if (endDate) {
        (query.createdAt as Record<string, Date>).$lte = new Date(endDate);
      }
    }

    // Add vendor filter
    if (vendorId) {
      query.vendor = vendorId;
    }

    // Add explorer filter
    if (explorerId) {
      query.explorer = explorerId;
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
        path: "vendor",
        select: "firstName lastName businessName email avatar",
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

    const response: AdminTransactionsResponse = {
      success: true,
      data: {
        payments: payments as unknown as AdminPayment[],
        total,
        page,
        limit,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching admin transactions:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
