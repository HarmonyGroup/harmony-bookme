import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import Settlement from "@/models/settlement";
import { GetSettlementDetailsResponse } from "@/types/settlement";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "vendor") {
      return NextResponse.json(
        { success: false, message: "Only vendors can access settlement details" },
        { status: 403 }
      );
    }

    await connectToDB();
    const { id } = await params;

    // Get settlement with payments
    const settlement = await Settlement.findOne({
      _id: id,
      vendor: session.user.id
    })
      .populate({
        path: "payments",
        populate: {
          path: "bookingId",
          select: "code type totalAmount details"
        }
      })
      .populate("vendor", "businessName email")
      .lean();

    if (!settlement) {
      return NextResponse.json(
        { success: false, message: "Settlement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: settlement as any,
    } as GetSettlementDetailsResponse);

  } catch (error: unknown) {
    console.error("Get settlement details error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
