import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Leisure } from "@/models/leisure";
import { ApiError } from "@/types/public/leisure";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDB();
    const { slug } = await params;
    const leisure = await Leisure.findOne({ slug });

    if (!leisure) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Leisure not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: leisure,
      message: "Leisure fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching leisure:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch leisure",
      },
      { status: 500 }
    );
  }
}