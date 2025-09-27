import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import { Notification } from "@/models/notification";
import { ApiError, NotificationsResponse } from "@/types/notification";

// GET /api/notifications
export async function GET(request: NextRequest) {
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

    await connectToDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "unread" | "read" | "" | null;
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    const query: Record<string, unknown> = { recipient: session.user.id, isActive: true };
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subtext: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const notifications = await Notification.find(query)
      .sort({ status: -1, createdAt: -1 }) // Unread first, then newest
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);

    return NextResponse.json<NotificationsResponse>({
      success: true,
      data: notifications,
      total,
    });
  } catch (error: unknown) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}