import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Movie from "@/models/movie";
import { Cinema as CinemaModel } from "@/models/cinema";
import moment from "moment";
import { Movie as MovieInterface, Cinema } from "@/types/vendor/movies-and-cinema";
import { MoviesResponse } from "@/types/public/movies-and-cinema";

// Type for populated movie document from MongoDB
type PopulatedMovieDocument = {
  _id: unknown;
  slug: string;
  movieCode: string;
  title: string;
  description: string;
  genre: string[];
  duration?: number;
  releaseDate: string;
  rating: string;
  images: string[];
  trailerUrl?: string;
  cinema: Cinema;
  showtimes: {
    _id?: unknown;
    date: Date;
    startTime: string;
    endTime?: string;
    auditorium: unknown;
    tickets: {
      _id?: unknown;
      name: string;
      basePrice?: number;
      hasDiscount?: boolean;
      discountType?: "percentage" | "fixed";
      discountValue?: number;
      soldCount: number;
      capacity: number;
    }[];
  }[];
  language?: string;
  subtitles?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Calculate endTime from startTime and duration
const calculateEndTime = (
  startTime: string,
  duration: number | undefined,
  date: string
): string | null => {
  if (!duration || !startTime || !date) return null;
  const [hours, minutes] = startTime.split(":").map(Number);
  const showDate = moment(date).set({
    hour: hours,
    minute: minutes,
    second: 0,
    millisecond: 0,
  });
  const endDate = showDate.clone().add(duration, "minutes");
  return endDate.format("HH:mm");
};

// Determine movie status
const getMovieStatus = (
  showtimes: MovieInterface["showtimes"],
  duration: number | undefined
): string => {
  if (!showtimes?.length || !duration) return "Unknown";
  const now = moment(); // Current time in WAT
  let hasNowShowing = false;
  let hasUpcoming = false;

  for (const showtime of showtimes) {
    const startDateTime = moment(showtime.date).set({
      hour: Number(showtime.startTime.split(":")[0]),
      minute: Number(showtime.startTime.split(":")[1]),
      second: 0,
      millisecond: 0,
    });

    const endTime = calculateEndTime(
      showtime.startTime,
      duration,
      showtime.date
    );
    if (!endTime) continue;

    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const endDateTime = startDateTime
      .clone()
      .set({ hour: endHours, minute: endMinutes });

    if (now.isBetween(startDateTime, endDateTime, undefined, "[]")) {
      hasNowShowing = true;
    } else if (now.isBefore(startDateTime)) {
      hasUpcoming = true;
    }
  }

  return hasNowShowing ? "Now showing" : hasUpcoming ? "Upcoming" : "Past";
};

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const genres = searchParams.get("genres")?.split(",") || [];
    const duration = searchParams.get("duration") || "";
    const skip = (page - 1) * limit;

    void CinemaModel;
    const query: Record<string, unknown> = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (genres.length > 0) {
      query.genre = { $in: genres };
    }

    if (duration) {
      if (duration === "under1") {
        query.duration = { $lt: 60 };
      } else if (duration === "1to2") {
        query.duration = { $gte: 60, $lte: 120 };
      } else if (duration === "above2") {
        query.duration = { $gt: 120 };
      }
    }

    const allMovies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .populate({ path: "cinema", strictPopulate: false });

    // Filter movies with "Now Showing" or "Upcoming" status
    const filteredMovies = allMovies.filter((movie) => {
      const status = getMovieStatus(movie.showtimes, movie.duration);
      return status === "Now showing" || status === "Upcoming";
    });

    const total = filteredMovies.length;
    const paginatedMovies = filteredMovies.slice(skip, skip + limit);

    // Convert Mongoose documents to plain Movie objects
    const moviesData: MovieInterface[] = paginatedMovies.map((movie: unknown) => {
      const movieDoc = movie as PopulatedMovieDocument;
      return {
        _id: movieDoc._id?.toString(),
        slug: movieDoc.slug,
        movieCode: movieDoc.movieCode,
        title: movieDoc.title,
        description: movieDoc.description,
        genre: movieDoc.genre,
        duration: movieDoc.duration,
        releaseDate: movieDoc.releaseDate,
        rating: movieDoc.rating,
        images: movieDoc.images,
        trailerUrl: movieDoc.trailerUrl,
        showtimes: movieDoc.showtimes.map((showtime) => ({
          _id: showtime._id?.toString() || '',
          date: showtime.date.toISOString(),
          startTime: showtime.startTime,
          endTime: showtime.endTime,
          auditorium: showtime.auditorium?.toString() || '',
          tickets: showtime.tickets.map((ticket) => ({
            _id: ticket._id?.toString() || '',
            name: ticket.name,
            basePrice: ticket.basePrice,
            hasDiscount: ticket.hasDiscount,
            discountType: ticket.discountType,
            discountValue: ticket.discountValue,
            soldCount: ticket.soldCount,
            capacity: ticket.capacity,
          })),
        })),
        cinema: movieDoc.cinema,
        language: movieDoc.language,
        subtitles: movieDoc.subtitles,
        createdAt: movieDoc.createdAt,
        updatedAt: movieDoc.updatedAt,
      };
    });

    return NextResponse.json<MoviesResponse>({
      success: true,
      data: moviesData,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      message: "Movies fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch movies",
      },
      { status: 500 }
    );
  }
}