import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/mongoose";
import { Event } from "@/models/event";
import { generateSlug } from "@/lib/utils";
import type {
  CreateEventListingRequest,
  CreateEventListingResponse,
  ApiError,
  EventListing,
} from "@/types/event";

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

    if (!["super_admin", "sub_admin"].includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to create events. Only administrators can perform this action.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const body: CreateEventListingRequest = await request.json();

    const requiredFields: (keyof CreateEventListingRequest)[] = [
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
      if (!body[field]) {
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

    const uniqueSlug = generateSlug(body.title);
    const eventCode = await generateEventCode(body.title || "");

    const eventData = {
      ...body,
      slug: uniqueSlug,
      eventCode,
      startDate,
      endDate,
      images: body.images || [],
      whatsIncluded: body.whatsIncluded || [],
      requirements: body.requirements || [],
      tags: body.tags || [],
      status: "active",
      // Admin-created events are platform events; vendor is intentionally left null
      isPlatformEvent: true,
    };

    const event = new Event(eventData);
    await event.save();

    const response: CreateEventListingResponse = {
      success: true,
      data: event.toObject() as unknown as EventListing,
      message: "Event listing created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating admin event:", error);
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error as { name: string }).name === "ValidationError"
    ) {
      const mongooseError = error as unknown as {
        errors: Record<string, { message: string }>;
      };
      const validationErrors = Object.values(mongooseError.errors).map(
        (err) => err.message
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

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
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

    if (!["super_admin", "sub_admin"].includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to view events. Only administrators can access this resource.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const pricingType = searchParams.get("pricingType") || "";
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (pricingType) {
      query.pricingType = pricingType;
    }

    const [events, total] = await Promise.all([
      Event.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
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
      },
      message: "Events fetched successfully",
    });
  } catch (error: unknown) {
    console.error("Error fetching admin events:", error);
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



