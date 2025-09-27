import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Booking } from "@/models/booking";
import { emitNotification } from "@/lib/notificationService";
import { VendorApprovalRequest, VendorApprovalResponse, ApiError } from "@/types/booking";

export async function PATCH(request: NextRequest) {
  try {
    const body: VendorApprovalRequest = await request.json();
    const { bookingId, action, message } = body;

    if (!bookingId || !action) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "MISSING_FIELDS",
          message: "Booking ID and action are required",
        },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "INVALID_ACTION",
          message: "Action must be either 'approve' or 'reject'",
        },
        { status: 400 }
      );
    }

    await connectToDB();

    // Find the booking
    const booking = await Booking.findById(bookingId).populate("explorer");
    if (!booking) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "BOOKING_NOT_FOUND",
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    // Check if booking is in requested status
    if (booking.status !== "requested") {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "INVALID_STATUS",
          message: "Booking does not have a requested status",
        },
        { status: 400 }
      );
    }

    // Check if vendor approval is already processed
    if (booking.vendorApproval?.status !== "pending") {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "ALREADY_PROCESSED",
          message: "Booking request has already been processed",
        },
        { status: 400 }
      );
    }

    // Update booking based on action
    const now = new Date();
    if (action === "approve") {
      booking.status = "pending"; // Move to pending for payment
      booking.vendorApproval = {
        status: "approved",
        message: message,
        approvedAt: now,
      };
    } else {
      booking.status = "cancelled"; // Rejected bookings are cancelled
      booking.vendorApproval = {
        status: "rejected",
        message: message,
        rejectedAt: now,
      };
    }

    await booking.save();

    // Emit notification to explorer
    await emitNotification("booking.vendor_decision", {
      bookingId: booking._id.toString(),
      explorerId: booking.explorer._id.toString(),
      listingId: booking.listing.toString(),
      listingTitle: booking.listingTitle || "Accommodation",
      listingType: booking.type,
      vendorId: booking.vendor?.toString(),
      action: action,
      message: message,
    });

    const response: VendorApprovalResponse = {
      success: true,
      message: `Booking ${action === "approve" ? "approved" : "rejected"} successfully`,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') ? error.message : "Failed to process booking request",
      },
      { status: 500 }
    );
  }
}
