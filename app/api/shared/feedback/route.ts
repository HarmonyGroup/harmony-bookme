import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Feedback } from "@/models/feedback";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  SubmitFeedbackRequest,
  SubmitFeedbackResponse,
  ApiError,
} from "@/types/feedback";

export async function POST(request: NextRequest) {
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
    if (!["vendor", "explorer"].includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to submit feedbacks. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }
    await connectToDB();
    const user = session.user.id;
    const body: SubmitFeedbackRequest = await request.json();

    const feedbackData = {
      ...body,
      user: user,
    };

    const feedback = new Feedback(feedbackData);
    await feedback.save();

    const response: SubmitFeedbackResponse = {
      success: true,
      data: feedback.toObject(),
      message: "Feedback submitted successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to submit feedback",
      },
      { status: 500 }
    );
  }
}