import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Payment } from "@/models/payment";
import { Booking } from "@/models/booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Leisure } from "@/models/leisure";
import { Event } from "@/models/event";
import { Accommodation } from "@/models/accommodation";
import Movie from "@/models/movie";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Authentication required. Please log in to continue.",
        },
        { status: 401 }
      );
    }

    if (!session.user.role || !["vendor"].includes(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: "FORBIDDEN",
          message: "Access denied. Vendor account required.",
        },
        { status: 403 }
      );
    }

    await connectToDB();
    const vendorId = session.user.id;

    // Get query parameters for date filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type"); // leisure, events, accommodations, movies_and_cinema

    // Build date filter
    const dateFilter: Record<string, unknown> = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    // Get total bookings for this vendor
    const totalBookings = await getTotalBookings(vendorId, type, dateFilter);

    // Get total successful payments for this vendor
    const totalSuccessfulPayments = await getTotalSuccessfulPayments(vendorId, dateFilter);

    // Get total listings for this vendor
    const totalListings = await getTotalListings(vendorId, type);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalBookings,
          totalSuccessfulPayments,
          totalListings,
        },
        message: "Vendor performance data retrieved successfully.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Vendor performance error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}

async function getTotalBookings(
  vendorId: string,
  type?: string | null,
  dateFilter?: Record<string, unknown>
): Promise<number> {
  const bookingFilters: Record<string, unknown> = {};
  
  // Apply date filter if provided
  if (dateFilter && Object.keys(dateFilter).length > 0) {
    bookingFilters.createdAt = dateFilter;
  }

  // Get all listing IDs for this vendor based on type
  const listingIds = await getVendorListingIds(vendorId, type);
  
  if (listingIds.length === 0) {
    return 0;
  }

  // Count bookings for these listings
  bookingFilters.listing = { $in: listingIds };
  
  return await Booking.countDocuments(bookingFilters);
}

async function getTotalSuccessfulPayments(
  vendorId: string,
  dateFilter?: Record<string, unknown>
): Promise<number> {
  const paymentFilter: Record<string, unknown> = {
    vendor: vendorId,
    status: "success",
  };

  // Apply date filter if provided
  if (dateFilter && Object.keys(dateFilter).length > 0) {
    paymentFilter.paidAt = dateFilter;
  }

  return await Payment.countDocuments(paymentFilter);
}

async function getTotalListings(
  vendorId: string,
  type?: string | null
): Promise<number> {
  const counts = await Promise.all([
    // Leisure listings
    type === "leisure" || !type
      ? Leisure.countDocuments({ vendor: vendorId })
      : 0,
    // Event listings
    type === "events" || !type
      ? Event.countDocuments({ organizer: vendorId })
      : 0,
    // Accommodation listings
    type === "accommodations" || !type
      ? Accommodation.countDocuments({ vendor: vendorId })
      : 0,
    // Movie listings (through cinema)
    type === "movies_and_cinema" || !type
      ? Movie.countDocuments({ "cinema.vendor": vendorId })
      : 0,
  ]);

  return counts.reduce((sum, count) => sum + count, 0);
}

async function getVendorListingIds(
  vendorId: string,
  type?: string | null
): Promise<string[]> {
  const listingIds: string[] = [];

  if (type === "leisure" || !type) {
    const leisureListings = await Leisure.find({ vendor: vendorId })
      .select("_id")
      .lean();
    listingIds.push(...leisureListings.map((listing: Record<string, unknown>) => String(listing._id)));
  }

  if (type === "events" || !type) {
    const eventListings = await Event.find({ organizer: vendorId })
      .select("_id")
      .lean();
    listingIds.push(...eventListings.map((listing: Record<string, unknown>) => String(listing._id)));
  }

  if (type === "accommodations" || !type) {
    const accommodationListings = await Accommodation.find({ vendor: vendorId })
      .select("_id")
      .lean();
    listingIds.push(...accommodationListings.map((listing: Record<string, unknown>) => String(listing._id)));
  }

  if (type === "movies_and_cinema" || !type) {
    const movieListings = await Movie.find({ "cinema.vendor": vendorId })
      .select("_id")
      .lean();
    listingIds.push(...movieListings.map((listing: Record<string, unknown>) => String(listing._id)));
  }

  return listingIds;
}