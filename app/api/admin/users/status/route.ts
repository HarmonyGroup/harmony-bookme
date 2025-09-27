import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/users";
import {
  useUpdateAccountStatusRequest,
  useUpdateAccountStatusResponse,
} from "@/types/admin/users";

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

    if (session.user.role !== "super_admin") {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to update account status. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const body: useUpdateAccountStatusRequest = await request.json();

    if (!body.id) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    if (!body.status) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Account status is required",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      _id: body.id,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "NOT_FOUND",
          message: "User not found",
        },
        { status: 404 }
      );
    }

    user.isActive = body?.status === "enable" ? true : false;
    await user.save();

    const response: useUpdateAccountStatusResponse = {
      success: true,
      message: "Account status updated successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to update account status",
      },
      { status: 500 }
    );
    console.error(error);
  }
}