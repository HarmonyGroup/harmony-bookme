import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Event } from "@/models/event";
import { generateSlug } from "@/lib/utils";
import type {
  CreateEventListingRequest,
  CreateEventListingResponse,
  ApiError,
} from "@/types/event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { emitNotification } from "@/lib/notificationService";

async function generateEventCode(title: string): Promise<string> {
  const prefix =
    title.length >= 2
      ? title.slice(0, 2).toUpperCase()
      : title[0].toUpperCase() + title[0].toUpperCase();
  const digits = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `${prefix}-${digits}`;
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
    if (!["vendor"].includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to create events. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();
    const vendor = session.user.id;
    const body: CreateEventListingRequest = await request.json();
    const requiredFields = [
      "title",
      "description",
      "summary",
      "category",
      "eventType",
      "format",
      "pricingType",
      "startDate",
      "endDate",
      "childrenPolicy",
      "petPolicy",
      "smokingPolicy",
    ];
    for (const field of requiredFields) {
      if (!body[field as keyof CreateEventListingRequest]) {
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
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    if (startDate >= endDate) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "End date must be after start date",
        },
        { status: 400 }
      );
    }
    if (body.format === "in-person") {
      if (
        !body.venueName ||
        !body.streetAddress ||
        !body.city ||
        !body.state ||
        !body.country
      ) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "VALIDATION_ERROR",
            message:
              "Venue details are required for in-person events",
          },
          { status: 400 }
        );
      }
    }
    if (body.format === "virtual") {
      if (!body.virtualPlatform || !body.virtualCapacity) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "VALIDATION_ERROR",
            message:
              "Virtual platform and capacity are required for virtual events",
          },
          { status: 400 }
        );
      }
    }
    if (body.pricingType === "paid") {
      if (!body.tickets || body.tickets.length === 0) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "VALIDATION_ERROR",
            message: "At least one ticket type is required for paid events",
          },
          { status: 400 }
        );
      }
    } else if (body.pricingType === "free") {
      // For free events, ensure freeEventCapacity is provided
      if (!body.freeEventCapacity) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "VALIDATION_ERROR",
            message:
              "Free event capacity is required for free events",
          },
          { status: 400 }
        );
      }
    }

    // Generate unique slug
    const uniqueSlug = generateSlug(body.title);

    const eventCode = await generateEventCode(body?.title || "");

    // Create event listing
    const eventData = {
      ...body,
      slug: uniqueSlug,
      eventCode,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      images: body?.images || [],
      whatsIncluded: body?.whatsIncluded || [],
      requirements: body?.requirements || [],
      tags: body?.tags || [],
      isActive: true,
      status: "active",
      vendor: vendor,
    };

    const event = new Event(eventData);
    await event.save();

    emitNotification("event.created", {
      eventId: event._id.toString(),
      title: body?.title,
      slug: uniqueSlug,
      vendorId: vendor,
    });

    const response: CreateEventListingResponse = {
      success: true,
      data: event.toObject(),
      message: "Event listing created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating event:", error);
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
          message: "An event with this title already exists",
        },
        { status: 409 }
      );
    }
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to create event listing",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const pricingType = searchParams.get("pricingType") || "";
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { };
    if (session?.user) {
      query.vendor = session.user.id;
    }
    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      query.category = category;
    }
    if (pricingType) {
      query.pricingType = pricingType;
    }

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

      console.log("vendorEvents", events);

    const total = await Event.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      message: "Events fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch events",
      },
      { status: 500 }
    );
  }
}