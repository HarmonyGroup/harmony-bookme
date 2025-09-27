import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Accommodation } from "@/models/accommodation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { type ApiError } from "@/types/accommodation";

interface DeleteAccommodationResponse {
  success: boolean;
  message: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const allowedRoles = ["vendor", "team_member", "super_admin", "sub_admin"];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to delete accommodations. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();
    const vendor = session.user.id;
    const { id: accommodationId } = await params;

    const accommodation = await Accommodation.findOneAndDelete({
      _id: accommodationId,
      vendor: vendor,
    });

    if (!accommodation) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message:
            "Accommodation not found or you do not have permission to delete it.",
        },
        { status: 404 }
      );
    }

    const response: DeleteAccommodationResponse = {
      success: true,
      message: "Accommodation deleted successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("Error deleting accommodation:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete accommodation",
      },
      { status: 500 }
    );
  }
}