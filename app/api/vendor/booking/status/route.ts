import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Booking } from "@/models/booking";
import { ApiError, UpdateBookingStatusResponse } from "@/types/booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UpdateBookingStatusRequest } from "@/types/booking";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Authentication required. Please log in to continue.",
        },
        { status: 401 }
      );
    }

    if (!session.user.role) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "INVALID_SESSION",
          message: "Invalid session data. Please log in again.",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "vendor") {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to update bookings. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const body: UpdateBookingStatusRequest = await request.json();

    if (!body.bookingId) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Booking ID is required",
        },
        { status: 400 }
      );
    }

    if (!body.status) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Status is required",
        },
        { status: 400 }
      );
    }

    const booking = await Booking.findOne({
      _id: body.bookingId,
    });

    if (!booking) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message:
            "Booking not found or you do not have permission to update it",
        },
        { status: 404 }
      );
    }

    booking.status = body.status;
    await booking.save();

    const response: UpdateBookingStatusResponse = {
      success: true,
      message: "Booking status updated successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to update booking status",
      },
      { status: 500 }
    );
  }
}