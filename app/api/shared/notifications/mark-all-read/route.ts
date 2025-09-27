import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import { Notification } from "@/models/notification";
import { ApiError } from "@/types/notification";

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Authentication required. Please log in to continue.",
        },
        { status: 401 }
      );
    }
    await connectToDB();
    const result = await Notification.updateMany(
      { recipient: session.user.id, status: "unread", isActive: true },
      { $set: { status: "read" } }
    );
    return NextResponse.json(
      {
        success: true,
        data: { updatedCount: result.modifiedCount },
        message: `${result.modifiedCount} notification(s) marked as read`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to mark all notifications as read",
      },
      { status: 500 }
    );
  }
}