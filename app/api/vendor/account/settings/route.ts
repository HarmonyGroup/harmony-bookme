// app/api/users/settings/update/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import UserSettings from "@/models/user-settings";
import type { ApiError } from "@/types/event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    const vendor = session.user.id;
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      allowMarketingEmails: body.allowMarketingEmails ?? false,
      subscribeToNewsletter: body.subscribeToNewsletter ?? false,
    };

    // Only update vendorNotifications for vendors
    if (session.user.role === "vendor") {
      updateData.vendorNotifications = body.vendorNotifications ?? false;
    }

    const settings = await UserSettings.findOneAndUpdate(
      { user: vendor },
      { $set: updateData },
      { new: true, runValidators: true, upsert: true }
    ).select("allowMarketingEmails subscribeToNewsletter vendorNotifications");

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: {
        allowMarketingEmails: settings.allowMarketingEmails,
        subscribeToNewsletter: settings.subscribeToNewsletter,
        vendorNotifications:
          settings.role === "vendor" ? settings.vendorNotifications : undefined,
      },
    });
  } catch (error: unknown) {
    console.error("Error updating user settings:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to update user settings",
      },
      { status: 500 }
    );
  }
}