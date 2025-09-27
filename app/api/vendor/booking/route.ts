import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Booking } from "@/models/booking";
import { Event } from "@/models/event";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiError, VendorBookingsResponse } from "@/types/booking";
import Movie from "@/models/movie";
import { Leisure } from "@/models/leisure";
import { Accommodation } from "@/models/accommodation";
import { Payment } from "@/models/payment";
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

    if (!session.user.role || !["vendor"].includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to view vendor bookings. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();
    const vendor = session.user.id;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const type = searchParams.get("type") || undefined;
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    void Payment;

    if (page < 1 || limit < 1) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "INVALID_INPUT",
          message: "Page and limit must be positive integers.",
        },
        { status: 400 }
      );
    }

    if (
      type &&
      !["events", "accommodations", "leisure", "movies_and_cinema"].includes(
        type
      )
    ) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "INVALID_INPUT",
          message: "Invalid booking type.",
        },
        { status: 400 }
      );
    }

    const query: Record<string, unknown> = {};

    if (type) {
      query.type = type;
    }

    if (search) {
      query.code = { $regex: search, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    // Add date filtering
    if (startDate || endDate) {
      query.createdAt = {};
      const createdAtQuery = query.createdAt as Record<string, unknown>;
      if (startDate) {
        createdAtQuery.$gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to endDate to include the entire end date
        const endDateTime = new Date(endDate);
        endDateTime.setDate(endDateTime.getDate() + 1);
        createdAtQuery.$lt = endDateTime;
      }
    }

    const listingModels = [
      { model: Event, type: "events", select: "title slug images" },
      { model: Accommodation, type: "accommodations", select: "name slug images" },
      { model: Leisure, type: "leisure", select: "name slug image" },
      { model: Movie, type: "movies_and_cinema", select: "title slug images" },
    ];

    const vendorListings = await Promise.all(
      listingModels.map(async ({ model, type }) => {
        const listings = await model
          .find({ vendor: vendor })
          .select("_id")
          .lean();
        return listings.map((listing: Record<string, unknown>) => ({
          listingId: listing._id,
          type,
        }));
      })
    );

    const vendorListingIds = vendorListings
      .flat()
      .filter((listing) => !type || listing.type === type)
      .map((listing) => listing.listingId);

    if (vendorListingIds.length === 0) {
      return NextResponse.json<VendorBookingsResponse>(
        {
          success: true,
          data: {
            bookings: [],
            total: 0,
            page,
            limit,
          },
        },
        { status: 200 }
      );
    }

    // Add listing IDs to query
    query.listing = { $in: vendorListingIds };

    // Fetch bookings
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        // .select(
        //   "type listing details totalAmount serviceFee status code createdAt"
        // )
        .populate("explorer", "firstName lastName avatar _id username")
        .populate("payment")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Booking.countDocuments(query),
    ]);

    // Populate listing details
    const formattedBookings = await Promise.all(
      bookings.map(async (booking) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let listing: any = null;

        if (booking.type === "events") {
          listing = await Event.findById(booking.listing)
            .select("title slug images")
            .lean();
        } else if (booking.type === "accommodations") {
              listing = await Accommodation.findById(booking.listing)
                .select("title slug images")
                .lean();
        } else if (booking.type === "leisure") {
          listing = await Leisure.findById(booking.listing)
            .select("title slug images")
            .lean();
        } else if (booking.type === "movies_and_cinema") {
          listing = await Movie.findById(booking.listing)
            .select("title slug images")
            .lean();
        }

        return {
          _id: booking?._id?.toString() || "",
          explorer: booking.explorer,
          type: booking.type,
          listing: listing
            ? {
                _id: booking.listing?.toString() || "",
                title: listing.title || listing.name || "Unknown",
                slug: listing.slug,
                images: listing.images || [],
              }
            : { _id: booking.listing?.toString() || "", title: "Unknown" },
          details: booking.details,
          totalAmount: booking.totalAmount,
          serviceFee: booking.serviceFee,
          coupon: booking.coupon,
          payment: booking.payment ? {
            _id: booking.payment._id?.toString() || "",
            bookingId: booking.payment.bookingId?.toString() || "",
            vendor: booking.payment.vendor?.toString() || "",
            explorer: booking.payment.explorer?.toString() || "",
            paystackReference: booking.payment.paystackReference || "",
            amount: booking.payment.amount || 0,
            currency: booking.payment.currency || "NGN",
            status: booking.payment.status || "pending",
            paymentMethod: booking.payment.paymentMethod || "",
            customerEmail: booking.payment.customerEmail || "",
            customerName: booking.payment.customerName || "",
            metadata: booking.payment.metadata || {},
            paidAt: booking.payment.paidAt?.toString() || undefined,
            settlementId: booking.payment.settlementId || undefined,
            settlementStatus: booking.payment.settlementStatus || undefined,
            vendorAmount: booking.payment.vendorAmount || undefined,
            platformAmount: booking.payment.platformAmount || undefined,
            paystackFees: booking.payment.paystackFees || undefined,
            createdAt: booking.payment.createdAt?.toString() || "",
            updatedAt: booking.payment.updatedAt?.toString() || "",
          } : null,
          paymentStatus: booking.paymentStatus,
          paymentReference: booking.paymentReference,
          status: booking.status,
          code: booking.code,
          createdAt: booking.createdAt?.toString() || "",
          updatedAt: booking.updatedAt?.toString() || "",
        };
      })
    );

    return NextResponse.json<VendorBookingsResponse>(
      {
        success: true,
        data: {
          bookings: formattedBookings,
          total,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Fetching bookings error:", error);
    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}