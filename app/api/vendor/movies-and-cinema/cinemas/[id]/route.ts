import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Cinema } from "@/models/cinema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiError } from "@/types/vendor/movies-and-cinema";

export async function GET(
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

    // Validate the id parameter
    const { id } = await params;
    
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "INVALID_PARAMETER",
          message: "Cinema ID is required and must be a valid identifier.",
        },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId format if using ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "INVALID_PARAMETER",
          message: "Invalid cinema ID format.",
        },
        { status: 400 }
      );
    }

    await connectToDB();

    const vendor = session.user.id;

    const cinema = await Cinema.findOne({
      _id: id,
      vendor: vendor,
    });

    if (!cinema) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Cinema not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cinema,
      message: "Cinema fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching cinema:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch cinema",
      },
      { status: 500 }
    );
  }
}