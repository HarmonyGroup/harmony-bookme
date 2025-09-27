import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Event } from "@/models/event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { type ApiError } from "@/types/event";

interface DeleteEventResponse {
  success: boolean;
  message: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate the user
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

    // Validate session role
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

    // Check if user has permission to delete events
    const allowedRoles = ["vendor", "team_member", "super_admin", "sub_admin"];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to delete events. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();
    const vendorId = session.user.id;
    const { id: eventId } = await params;

    // Delete the event only if it belongs to the authenticated vendor
    const event = await Event.findOneAndDelete({
      _id: eventId,
      vendor: vendorId,
    });

    if (!event) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message:
            "Event not found or you do not have permission to delete it.",
        },
        { status: 404 }
      );
    }

    const response: DeleteEventResponse = {
      success: true,
      message: "Event deleted successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("Error deleting event:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete event",
      },
      { status: 500 }
    );
  }
}