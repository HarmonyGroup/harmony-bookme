import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Leisure } from '@/models/leisure';

export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isActive: true };
    
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }

    const [leisures, total] = await Promise.all([
      Leisure.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Leisure.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: leisures,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      message: "Leisure activities fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching leisure listings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch leisure listings",
      },
      { status: 500 }
    );
  }
}