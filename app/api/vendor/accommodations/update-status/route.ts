import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Accommodation } from "@/models/accommodation";
import type { ApiError } from "@/types/accommodation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const VALID_STATUSES = ["available", "booked", "unavailable"] as const;
type AccommodationStatus = (typeof VALID_STATUSES)[number];

interface UpdateAccommodationStatusRequest {
  accommodationId: string;
  status: AccommodationStatus;
}

interface UpdateAccommodationStatusResponse {
  success: true;
  data: {
    _id: string;
    status: AccommodationStatus;
  };
  message: string;
}

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
            "You don't have permission to update accommodations. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const vendor = session.user.id;
    const body: UpdateAccommodationStatusRequest = await request.json();

    // Validate required fields
    if (!body.accommodationId) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Accommodation ID is required",
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

    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: `Invalid status. Must be one of: ${VALID_STATUSES.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Find accommodation and verify ownership
    const accommodation = await Accommodation.findOne({
      _id: body.accommodationId,
      vendor: vendor,
    });

    if (!accommodation) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message:
            "Accommodation not found or you do not have permission to update it",
        },
        { status: 404 }
      );
    }

    // Update status
    accommodation.status = body.status;
    await accommodation.save();

    const response: UpdateAccommodationStatusResponse = {
      success: true,
      data: {
        _id: accommodation._id.toString(),
        status: accommodation.status,
      },
      message: "Accommodation status updated successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating accommodation status:", error);

    // Handle MongoDB validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === "ValidationError") {
      const validationErrors = Object.values((error as Record<string, unknown>).errors as Record<string, unknown>).map(
        (err: unknown) => (err as Record<string, unknown>).message
      );
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: validationErrors.join(", "),
        },
        { status: 400 }
      );
    }

    // Handle invalid ObjectId
    if (error && typeof error === 'object' && 'name' in error && error.name === "CastError") {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "INVALID_ID",
          message: "Invalid accommodation ID",
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to update accommodation status",
      },
      { status: 500 }
    );
  }
}