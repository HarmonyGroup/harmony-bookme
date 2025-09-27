import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/users";
import type { ApiError } from "@/types/event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
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
    if (!["vendor"].includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to access vendor information. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();
    const vendorId = session.user.id;

    const user = await User.findById(vendorId).select(
      "businessName email phone country state city streetAddress avatar"
    );

    if (!user) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Vendor not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Vendor details retrieved successfully",
      data: {
        businessName: user.businessName || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
        state: user.state || "",
        city: user.city || "",
        streetAddress: user.streetAddress || "",
        avatar: user.avatar || "",
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching vendor information:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch vendor information",
      },
      { status: 500 }
    );
  }
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
    if (!["vendor"].includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to update vendor information. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();
    const vendorId = session.user.id;
    const body = await request.json();

    const user = await User.findById(vendorId);
    if (!user) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Vendor not found",
        },
        { status: 404 }
      );
    }

    const updateData = {
      businessName: body.businessName || user.businessName,
      email: body.email || user.email,
      phone: body.phone || user.phone,
      country: body.country || user.country,
      state: body.state || user.state,
      city: body.city || user.city,
      streetAddress: body.streetAddress || user.streetAddress,
      avatar: body.avatar || user.avatar,
    };

    const updatedUser = await User.findByIdAndUpdate(
      vendorId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Vendor details updated successfully",
      data: updatedUser,
    });
  } catch (error: unknown) {
    console.error("Error updating vendor information:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to update vendor information",
      },
      { status: 500 }
    );
  }
}