import { NextRequest, NextResponse } from "next/server";
import { Accommodation } from "@/models/accommodation";
import { connectToDB } from "@/lib/mongoose";

interface AccommodationQuery {
  isActive: boolean;
  title?: { $regex: string; $options: string };
  status?: string;
  bedrooms?: number | { $gte: number };
  bathrooms?: number | { $gte: number };
  buildingType?: string;
  basePrice?: {
    $gte?: number;
    $lte?: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const bedrooms = searchParams.get("bedrooms") || "";
    const bathrooms = searchParams.get("bathrooms") || "";
    const buildingType = searchParams.get("buildingType") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const skip = (page - 1) * limit;

    const query: AccommodationQuery = { isActive: true };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (status) {
      query.status = status;
    }
    if (bedrooms) {
      query.bedrooms = bedrooms.includes("6+") ? { $gte: 6 } : Number(bedrooms);
    }
    if (bathrooms) {
      query.bathrooms = bathrooms.includes("6+") ? { $gte: 6 } : Number(bathrooms);
    }
    if (buildingType) {
      query.buildingType = buildingType;
    }
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    const [accommodations, total] = await Promise.all([
      Accommodation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Accommodation.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: accommodations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      message: "Accommodations fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch accommodations",
      },
      { status: 500 }
    );
  }
}