import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/models/event";
import { connectToDB } from "@/lib/mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const pricingType = searchParams.get("pricingType") || "";
    const format = searchParams.get("format") || "";
    const date = searchParams.get("date") || "";
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isActive: true };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }
    if (pricingType) {
      query.pricingType = pricingType;
    }
    if (format) {
      query.format = format;
    }
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.startDate = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    const [events, total] = await Promise.all([
      Event.find(query).sort({ startDate: 1 }).skip(skip).limit(limit).lean(),
      Event.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      message: "Events fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch events",
      },
      { status: 500 }
    );
  }
};