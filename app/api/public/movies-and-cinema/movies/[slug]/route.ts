import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Movie from "@/models/movie";
import { type ApiError } from "@/types/accommodation";
import { Cinema } from "@/models/cinema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDB();
    const { slug } = await params;
    void Cinema;

    const movie = await Movie.findOne({ slug }).populate("cinema");
    if (!movie) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Movie not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: movie,
      message: "Movie fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch movie",
      },
      { status: 500 }
    );
  }
}