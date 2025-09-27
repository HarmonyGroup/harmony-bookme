import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { ApiError } from "@/types/accommodation";

interface UpdateAvatarResponse {
  success: true;
  message: string;
  data: {
    avatar: string;
  };
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
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
    const userId = session.user.id;
    const body = await request.json();
    const { avatar } = body;

    // Validate avatar URL
    if (!avatar || typeof avatar !== "string") {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Avatar URL is required.",
        },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(avatar);
    } catch {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Invalid avatar URL format.",
        },
        { status: 400 }
      );
    }

    // Update user avatar
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { avatar } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const response: UpdateAvatarResponse = {
      success: true,
      message: "Avatar updated successfully",
      data: {
        avatar: updatedUser.avatar || "",
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating avatar:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to update avatar",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Check authentication
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
    const userId = session.user.id;

    // Remove user avatar
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $unset: { avatar: 1 } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const response: UpdateAvatarResponse = {
      success: true,
      message: "Avatar removed successfully",
      data: {
        avatar: "",
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("Error removing avatar:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove avatar",
      },
      { status: 500 }
    );
  }
}