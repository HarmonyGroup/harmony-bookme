import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Accommodation } from "@/models/accommodation";
import { generateSlug } from "@/lib/utils";
import type {
  CreateAccommodationListingRequest,
  CreateAccommodationListingResponse,
  ApiError,
} from "@/types/accommodation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { emitNotification } from "@/lib/notificationService";

async function generateAccommodationCode(): Promise<string> {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = `#${Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("")}`;

    // Check if code is unique
    const existingCode = await Accommodation.findOne({
      accommodationCode: code,
    }).session(null);
    if (!existingCode) {
      return code;
    }
  }

  throw new Error(
    "Unable to generate a unique booking code after multiple attempts."
  );
}

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

    if (session.user.role !== "vendor") {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to create accommodations. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const vendor = session.user.id;
    const body: CreateAccommodationListingRequest = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "accommodationType",
      "country",
      "state",
      "city",
      "streetAddress",
      "checkInTime",
      "checkOutTime",
      "smokingPolicy",
      "petPolicy",
      "childrenPolicy",
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof CreateAccommodationListingRequest]) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "VALIDATION_ERROR",
            message: `${field} is required`,
          },
          { status: 400 }
        );
      }
    }

    // Conditional validation based on accommodation type
    if (body.accommodationType === "shortlet") {
      // For shortlets, these fields are required
      const shortletRequiredFields = ["buildingType", "bedrooms", "bathrooms", "maxGuests", "basePrice"];
      
      for (const field of shortletRequiredFields) {
        if (!body[field as keyof CreateAccommodationListingRequest]) {
          return NextResponse.json<ApiError>(
            {
              success: false,
              error: "VALIDATION_ERROR",
              message: `${field} is required for shortlet accommodations`,
            },
            { status: 400 }
          );
        }
      }
    } else if (body.accommodationType === "hotel") {
      // For hotels, rooms array is required
      if (!body.rooms || body.rooms.length === 0) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "VALIDATION_ERROR",
            message: "At least one room is required for hotel accommodations",
          },
          { status: 400 }
        );
      }

      // Validate each room has required fields
      for (let i = 0; i < body.rooms.length; i++) {
        const room = body.rooms[i];
        if (!room.name || !room.availableRooms || !room.basePrice) {
          return NextResponse.json<ApiError>(
            {
              success: false,
              error: "VALIDATION_ERROR",
              message: `Room ${i + 1} is missing required fields: name, availableRooms, and basePrice are required`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Generate unique slug with random suffix
    const uniqueSlug = generateSlug(body.title);

    const accommodationCode = await generateAccommodationCode();

    // Create accommodation listing
    const accommodationData = {
      ...body,
      slug: uniqueSlug,
      amenities: body.amenities || {},
      tags: body.tags || [],
      whatsIncluded: body.whatsIncluded || [],
      isActive: true,
      status: "available",
      accommodationCode,
      vendor: vendor,
    };

    const accommodation = new Accommodation(accommodationData);
    await accommodation.save();

    emitNotification("accommodation.created", {
      accommodationId: accommodation._id.toString(),
      title: body.title,
      slug: uniqueSlug,
      vendorId: vendor,
    });

    const response: CreateAccommodationListingResponse = {
      success: true,
      data: accommodation.toObject(),
      message: "Accommodation created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating accommodation:", error);

    // Handle MongoDB validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === "ValidationError") {
      const validationErrors = Object.values((error as Record<string, unknown>).errors as Record<string, unknown>).map(
        (err: unknown) => (err as Record<string, unknown>).message
      );
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: validationErrors.join(", "),
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "DUPLICATE_ERROR",
          message: "An accommodation with this title already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to create accommodation",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const session = await getServerSession(authOptions);
    const query: Record<string, unknown> = { isActive: true };

    if (session?.user?.role === "vendor") {
      query.vendor = session.user.id;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const accommodations = await Accommodation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Accommodation.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: accommodations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      message: "Accommodations fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch accommodations",
      },
      { status: 500 }
    );
  }
}