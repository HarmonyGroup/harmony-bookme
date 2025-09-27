import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Accommodation } from "@/models/accommodation";
import { type ApiError } from "@/types/accommodation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDB();
    const { slug } = await params;

    const event = await Accommodation.findOne({
      slug: slug,
    });

    if (!event) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Accommodation not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event,
      message: "Accommodation fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching accommodation:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch accommodation",
      },
      { status: 500 }
    );
  }
}