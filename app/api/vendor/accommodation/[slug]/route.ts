import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Accommodation } from "@/models/accommodation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { type ApiError } from "@/types/event";
import { toUrlSafe } from "@/utils/usernameGenerator";

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

    const accommodation = await Accommodation.findOne({
      slug: slug,
      vendor: vendor,
    });

    if (!accommodation) {
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
      data: accommodation,
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

export async function PUT(
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
    const body = await request.json();

    // Find the accommodation
    const accommodation = await Accommodation.findOne({
      slug: slug,
      vendor: vendor,
    });

    if (!accommodation) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Accommodation not found.",
        },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let newSlug = slug;
    if (body.title && body.title !== accommodation.title) {
      newSlug = toUrlSafe(body.title);
      // Ensure slug uniqueness
      let slugExists = await Accommodation.findOne({ slug: newSlug, _id: { $ne: accommodation._id } });
      let counter = 1;
      while (slugExists) {
        newSlug = `${toUrlSafe(body.title)}-${counter}`;
        slugExists = await Accommodation.findOne({ slug: newSlug, _id: { $ne: accommodation._id } });
        counter++;
      }
    }

    // Update the accommodation
    const updatedAccommodation = await Accommodation.findOneAndUpdate(
      { _id: accommodation._id, vendor: vendor },
      {
        ...body,
        slug: newSlug,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedAccommodation) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "UPDATE_FAILED",
          message: "Failed to update accommodation.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedAccommodation,
      message: "Accommodation updated successfully",
    });
  } catch (error) {
    console.error("Error updating accommodation:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to update accommodation",
      },
      { status: 500 }
    );
  }
}