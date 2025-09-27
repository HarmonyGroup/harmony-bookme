import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  UpdatePersonalDetailsRequest,
  UpdatePersonalDetailsResponse,
} from "@/types/explorer/account";

interface ApiError {
  success: false;
  error: string;
  message: string;
}

export async function PATCH(request: NextRequest) {
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

    if (!session.user.role || session.user.role !== "explorer") {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "Invalid session data. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const userId = session.user.id;
    const body: UpdatePersonalDetailsRequest = await request.json();

    const userDoc = await User.findOne({ _id: userId });

    if (!userDoc) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Account not found.",
        },
        { status: 404 }
      );
    }

    const allowedFields = [
      "firstName",
      "lastName",
      "username",
      "email",
      "phone",
    ];
    const updateData: Record<string, unknown> = {};

    // Dynamically include only provided fields that match allowed fields
    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        updateData[key] = value;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "BAD_REQUEST",
          message: "No valid fields provided to update.",
        },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Failed to update account. User not found.",
        },
        { status: 404 }
      );
    }
    const response: UpdatePersonalDetailsResponse = {
      success: true,
      data: {
        id: updatedUser._id.toString(),
        firstName: updatedUser.firstName || null,
        lastName: updatedUser.lastName || null,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone || null,
      },
      message: "Personal details updated successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to update account details",
      },
      { status: 500 }
    );
    console.error(error);
  }
}