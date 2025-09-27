import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Cinema } from "@/models/cinema";
import { generateSlug } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  CreateCinemaRequest,
  CreateCinemaResponse,
  ApiError,
} from "@/types/vendor/movies-and-cinema";

async function generateCinemaCode(): Promise<string> {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = `#${Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("")}`;

    // Check if code is unique
    // const existingCode = await Cinema.findOne({
    //   accommodationCode: code,
    // }).session(null);
    // if (!existingCode) {
    return code;
    // }
  }

  throw new Error(
    "Unable to generate a unique cinema code after multiple attempts."
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
            "You don't have permission to create cinemas. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const vendor = session.user.id;
    const body: CreateCinemaRequest = await request.json();

    const uniqueSlug = generateSlug(body.title);

    const cinemaCode = await generateCinemaCode();

    const cinemaData = {
      ...body,
      slug: uniqueSlug,
      cinemaCode,
      vendor,
    };

    const cinema = new Cinema(cinemaData);
    await cinema.save();

    const response: CreateCinemaResponse = {
      success: true,
      data: cinema.toObject(),
      message: "Cinema created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating cinema:", error);

    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to create cinema",
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
    const query: Record<string, unknown> = {};
    if (session?.user) {
      query.vendor = session.user.id;
    }
    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    const cinemas = await Cinema.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Cinema.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: cinemas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      message: "Cinemas fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching cinemas:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch cinemas",
      },
      { status: 500 }
    );
  }
}