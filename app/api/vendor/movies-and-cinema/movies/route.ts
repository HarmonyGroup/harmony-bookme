import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Movie from "@/models/movie";
import { generateSlug } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  CreateMovieRequest,
  CreateMovieResponse,
} from "@/types/vendor/movies-and-cinema";

async function generateMovieCode(title: string): Promise<string> {
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
    const body: CreateMovieRequest = await request.json();

    const uniqueSlug = generateSlug(body?.title);

    const movieCode = await generateMovieCode(body.title);

    const movieData = {
      ...body,
      slug: uniqueSlug,
      movieCode,
      vendor,
    };

    const movie = new Movie(movieData);
    await movie.save();

    const response: CreateMovieResponse = {
      success: true,
      data: movie.toObject(),
      message: "Movie created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating movie:", error);

    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to create movie",
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

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("cinema");

    const total = await Movie.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      message: "Movies fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch movies",
      },
      { status: 500 }
    );
  }
};