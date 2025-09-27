import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Event } from "@/models/event";
import { type ApiError } from "@/types/event";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDB();
    const { slug } = await params;

    const event = await Event.findOne({
      slug: slug,
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
};