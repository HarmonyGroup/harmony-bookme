import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Movie from "@/models/movie";
import { Cinema } from "@/models/cinema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import moment from "moment";
import {
  GetMoviesTodayResponse,
  ApiError,
} from "@/types/vendor/movies-and-cinema";

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

    if (session.user.role !== "vendor") {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message: "Access restricted to vendors only.",
        },
        { status: 403 }
      );
    }

    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const cinema = searchParams.get("cinema") || "";
    const skip = (page - 1) * limit;

    // Get current date range (local server time, assumed WAT)
    const todayStart = moment().startOf("day").toDate(); // 2025-07-27T00:00:00.000Z
    const todayEnd = moment().endOf("day").toDate(); // 2025-07-27T23:59:59.999Z

    void Cinema;

    // Build query
    const query: Record<string, unknown> = {
      vendor: session.user.id,
      "showtimes.date": {
        $gte: todayStart,
        $lt: todayEnd,
      },
    };
    if (search) {
      query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (cinema) {
      query.cinema = cinema; // Match cinema ObjectId
    }

    // Fetch movies
    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("cinema"); // Populates Cinemas model

    const total = await Movie.countDocuments(query);

    return NextResponse.json<GetMoviesTodayResponse>(
      {
        success: true,
        data: movies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        message: movies.length
          ? "Movies showing today retrieved successfully"
          : "No movies showing today",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching movies for today:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch movies",
      },
      { status: 500 }
    );
  }
}