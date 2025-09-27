import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/users";
import type { ApiError } from "@/types/accommodation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  NewsletterSubscriptionRequest,
  NewsletterSubscriptionResponse,
} from "@/types/newsletter";

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

    await connectToDB();

    const user = session.user.id;
    const body: NewsletterSubscriptionRequest = await request.json();

    const userDoc = await User.findOne({
      _id: user,
    });

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

    userDoc.isNewsletterSubscribed = body.isNewsletterSubscribed;

    await userDoc.save();

    const response: NewsletterSubscriptionResponse = {
      success: true,
      message:
        body?.isNewsletterSubscribed === true
          ? "Subscribed to newsletter successfully"
          : "Unsubscribed to newsletter successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log(error);
    const body: NewsletterSubscriptionRequest = await request.json();
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message:
          body?.isNewsletterSubscribed === true
            ? "Failed to subscribe to newsletter"
            : "Failed to unsubscribe to newsletter",
      },
      { status: 500 }
    );
  }
}