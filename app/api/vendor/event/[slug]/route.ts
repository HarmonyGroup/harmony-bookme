import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Event } from "@/models/event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { type ApiError } from "@/types/event";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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

    await connectToDB();

    const vendor = session.user.id;
    const { slug } = await params;

    const event = await Event.findOne({
      slug: slug,
      vendor: vendor,
    });

    if (!event) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Event not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event,
      message: "Event fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch event",
      },
      { status: 500 }
    );
  }
}