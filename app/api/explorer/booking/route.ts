import mongoose from "mongoose";
import { type NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Booking } from "@/models/booking";
import { Event } from "@/models/event";
import { Accommodation } from "@/models/accommodation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiError, CreateBookingRequest } from "@/types/booking";
import Movie from "@/models/movie";
// import { Cinema } from "@/models/cinema";
import { Leisure } from "@/models/leisure";
import { initializePayment } from "@/services/shared/payment-initialization";
import { createAccommodationBookingRequest } from "@/services/explorer/accommodation-booking";

// Define proper interfaces for ticket types
interface EventTicketType {
  _id: mongoose.Types.ObjectId;
  name: string;
  basePrice: number;
  capacity: number;
  soldCount: number;
  hasDiscount?: boolean;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
}

interface MovieTicketType {
  _id: mongoose.Types.ObjectId;
  name: string;
  basePrice: number;
  capacity: number;
  soldCount: number;
  hasDiscount?: boolean;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
}

interface LeisureTicketType {
  _id: mongoose.Types.ObjectId;
  name: string;
  basePrice: number;
  capacity: number;
  soldCount: number;
  hasDiscount?: boolean;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
}

interface ListingDetails {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  images?: string[];
  accommodationType?: string;
}

interface MovieShowtime {
  _id: mongoose.Types.ObjectId;
  tickets: MovieTicketType[];
}

interface MovieDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  showtimes: MovieShowtime[];
  cinema: mongoose.Types.ObjectId;
  save(options?: { session?: mongoose.ClientSession }): Promise<MovieDocument>;
}

interface EventDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  tickets: EventTicketType[];
  save(options?: { session?: mongoose.ClientSession }): Promise<EventDocument>;
}

interface LeisureDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  tickets: LeisureTicketType[];
  save(options?: {
    session?: mongoose.ClientSession;
  }): Promise<LeisureDocument>;
}

interface AccommodationDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
}

async function generateBookingCode(title: string): Promise<string> {
  const prefix =
    title?.length >= 2
      ? title?.slice(0, 2)?.toUpperCase()
      : title?.[0]?.toUpperCase() + title?.[0]?.toUpperCase();
  const digits = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `${prefix}-${digits}`;
}

async function getCoupon(couponCode: string) {
  if (couponCode.toLowerCase() === "save10") {
    return { type: "percentage", value: 10 };
  } else if (couponCode.toLowerCase() === "fixed25000") {
    return { type: "fixed", value: 25000 };
  }
  return null;
}

async function calculateTotals(
  details: CreateBookingRequest["details"],
  type: string,
  coupon: { type: string; value: number } | null,
  listing: string,
  session: mongoose.ClientSession
): Promise<{ subtotal: number; serviceFee: number; totalAmount: number }> {
  let subtotal = 0;

  if (type === "events") {
    if (!("tickets" in details) || !Array.isArray(details.tickets)) {
      throw new Error("Event bookings require a tickets array in details");
    }

    const event = (await Event.findById(listing).session(
      session
    )) as EventDocument | null;
    if (!event) {
      throw new Error("Event not found");
    }

    subtotal = details.tickets.reduce(
      (sum: number, ticket: { ticketTypeId: string; quantity: number }) => {
        const ticketType = event.tickets.find(
          (t: EventTicketType) => t._id.toString() === ticket.ticketTypeId
        );

        if (!ticketType) {
          throw new Error(`Invalid ticket type: ${ticket.ticketTypeId}`);
        }

        // Calculate ticket price with discount if applicable
        let ticketPrice = ticketType.basePrice;
        if (
          ticketType.hasDiscount &&
          ticketType.discountType &&
          ticketType.discountValue
        ) {
          if (ticketType.discountType === "percentage") {
            ticketPrice =
              ticketType.basePrice * (1 - ticketType.discountValue / 100);
          } else {
            ticketPrice = ticketType.basePrice - ticketType.discountValue;
          }
        }

        return sum + ticket.quantity * ticketPrice;
      },
      0
    );
  } else if (type === "accommodations") {
    if (
      !("checkInDate" in details) ||
      !("checkOutDate" in details) ||
      !("price" in details) ||
      typeof details.price !== "number" ||
      typeof details.checkInDate !== "string" ||
      typeof details.checkOutDate !== "string"
    ) {
      throw new Error(
        "Accommodation bookings require valid checkInDate, checkOutDate, and price in details"
      );
    }

    const checkIn = new Date(details.checkInDate);
    const checkOut = new Date(details.checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      throw new Error("Invalid checkInDate or checkOutDate");
    }

    if (checkOut <= checkIn) {
      throw new Error("Check-out date must be after check-in date");
    }

    const numberOfDays = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    subtotal = details.price * numberOfDays;
  } else if (type === "movies_and_cinema") {
    if (
      !("tickets" in details) ||
      !Array.isArray(details.tickets) ||
      !("showtime" in details) ||
      typeof details.showtime !== "string"
    ) {
      throw new Error(
        "Movie bookings require a showtime ID and a tickets array in details"
      );
    }

    const movie = (await Movie.findById(listing)
      .populate("cinema")
      // .populate("showtimes.auditorium")
      .session(session)) as MovieDocument | null;
    if (!movie) {
      throw new Error("Movie not found");
    }

    const showtime = movie.showtimes.find(
      (st: MovieShowtime) => st._id.toString() === details.showtime
    );
    if (!showtime) {
      throw new Error(`Showtime ${details.showtime} not found`);
    }

    subtotal = details.tickets.reduce(
      (sum: number, ticket: { ticketTypeId: string; quantity: number }) => {
        const ticketType = showtime.tickets.find(
          (t: MovieTicketType) => t._id.toString() === ticket.ticketTypeId
        );

        if (!ticketType) {
          throw new Error(`Invalid ticket type: ${ticket.ticketTypeId}`);
        }

        const price =
          ticketType.hasDiscount && ticketType.discountValue
            ? ticketType.discountType === "percentage"
              ? ticketType.basePrice * (1 - ticketType.discountValue / 100)
              : ticketType.basePrice - ticketType.discountValue
            : ticketType.basePrice;

        return sum + ticket.quantity * price;
      },
      0
    );
  } else if (type === "leisure") {
    if (
      !("tickets" in details) ||
      !Array.isArray(details.tickets) ||
      details.tickets.length === 0
    ) {
      throw new Error(
        "Leisure bookings require at least one ticket in details"
      );
    }

    const leisure = (await Leisure.findById(listing).session(
      session
    )) as LeisureDocument | null;
    if (!leisure) {
      throw new Error("Leisure activity not found");
    }

    subtotal = details.tickets.reduce(
      (sum: number, ticket: { ticketTypeId: string; quantity: number }) => {
        const ticketType = leisure.tickets.find(
          (t: LeisureTicketType) => t._id.toString() === ticket.ticketTypeId
        );

        if (!ticketType) {
          throw new Error(`Invalid ticket type: ${ticket.ticketTypeId}`);
        }

        // Calculate ticket price with discount if applicable
        let ticketPrice = ticketType.basePrice;
        if (
          ticketType.hasDiscount &&
          ticketType.discountType &&
          ticketType.discountValue
        ) {
          if (ticketType.discountType === "percentage") {
            ticketPrice =
              ticketType.basePrice * (1 - ticketType.discountValue / 100);
          } else {
            ticketPrice = ticketType.basePrice - ticketType.discountValue;
          }
        }

        return sum + ticket.quantity * ticketPrice;
      },
      0
    );
  }

  const serviceFee = 0; // No service fee
  let couponDiscount = 0;
  if (coupon) {
    couponDiscount =
      coupon.type === "percentage"
        ? (coupon.value / 100) * subtotal
        : coupon.value;
  }
  const totalAmount = Math.max(0, subtotal - couponDiscount);

  return { subtotal, serviceFee, totalAmount };
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

    if (!["explorer"].includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "Create an explorer account to continue booking. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();
    const explorer = session.user.id;
    const body: CreateBookingRequest = await request.json();

    // Basic input validation
    if (
      !body.type ||
      !["events", "accommodations", "leisure", "movies_and_cinema"].includes(
        body.type
      )
    ) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "INVALID_INPUT",
          message: "Invalid or missing booking type.",
        },
        { status: 400 }
      );
    }

    if (!body.listing || !mongoose.isValidObjectId(body.listing)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "INVALID_INPUT",
          message: "Invalid or missing listing ID.",
        },
        { status: 400 }
      );
    }

    // Validate movies_and_cinema-specific details
    if (body.type === "movies_and_cinema") {
      if (
        !body.details ||
        !("showtime" in body.details) ||
        !("tickets" in body.details) ||
        !Array.isArray(body.details.tickets)
      ) {
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "INVALID_INPUT",
            message:
              "Movie bookings require showtime and tickets array in details.",
          },
          { status: 400 }
        );
      }
    }

    // Handle accommodation bookings differently
    if (body.type === "accommodations") {
      try {
        const result = await createAccommodationBookingRequest({
          data: body,
          explorerId: explorer,
        });
        return NextResponse.json(result, { status: 201 });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create accommodation booking request.";
        return NextResponse.json<ApiError>(
          {
            success: false,
            error: "ACCOMMODATION_BOOKING_FAILED",
            message: errorMessage,
          },
          { status: errorMessage.includes("not found") ? 404 : 400 }
        );
      }
    }

    // Start MongoDB transaction for other booking types
    const sessionDB = await mongoose.startSession();
    let paymentData = null;

    try {
      const booking = await sessionDB.withTransaction(async () => {
        // Validate listing existence
        let listingDoc:
          | EventDocument
          | MovieDocument
          | LeisureDocument
          | AccommodationDocument
          | null = null;
        if (body.type === "events") {
          listingDoc = (await Event.findById(body.listing).session(
            sessionDB
          )) as EventDocument | null;
          if (!listingDoc) {
            throw new Error("Event not found.");
          }

          if (
            !("tickets" in body.details) ||
            !Array.isArray(body.details.tickets)
          ) {
            throw new Error("Event bookings require at least one ticket.");
          }

          for (const ticket of body.details.tickets) {
            const ticketType = (listingDoc as EventDocument).tickets.find(
              (t: EventTicketType) => t._id.toString() === ticket.ticketTypeId
            );
            if (!ticketType) {
              throw new Error(`Invalid ticket type: ${ticket.ticketTypeId}`);
            }
            if (ticketType.soldCount + ticket.quantity > ticketType.capacity) {
              throw new Error(
                `Not enough tickets available for ${ticketType.name}.`
              );
            }
            ticketType.soldCount += ticket.quantity;
          }
          await (listingDoc as EventDocument).save({ session: sessionDB });
        } else if (body.type === "accommodations") {
          // Accommodation bookings are now handled separately above
          throw new Error(
            "Accommodation bookings should be handled by createAccommodationBookingRequest"
          );
        } else if (body.type === "movies_and_cinema") {
          listingDoc = (await Movie.findById(body.listing)
            .populate("cinema")
            // .populate("showtimes.auditorium")
            .session(sessionDB)) as MovieDocument | null;
          if (!listingDoc) {
            throw new Error("Movie not found.");
          }

          if (
            !("tickets" in body.details) ||
            !Array.isArray(body.details.tickets) ||
            !("showtime" in body.details)
          ) {
            throw new Error(
              "Movie bookings require at least one ticket and a showtime."
            );
          }

          // Type guard for movie details
          if (!("showtime" in body.details) || !("tickets" in body.details)) {
            throw new Error(
              "Movie bookings require showtime and tickets in details"
            );
          }

          // Type assertion for movie details
          const movieDetails = body.details as {
            showtime: string;
            tickets: { ticketTypeId: string; quantity: number }[];
          };

          const showtime = (listingDoc as MovieDocument).showtimes.find(
            (st: MovieShowtime) => st._id.toString() === movieDetails.showtime
          );
          if (!showtime) {
            throw new Error(`Showtime ${movieDetails.showtime} not found.`);
          }

          for (const ticket of movieDetails.tickets) {
            const ticketType = showtime.tickets.find(
              (t: MovieTicketType) => t._id.toString() === ticket.ticketTypeId
            );
            if (!ticketType) {
              throw new Error(`Invalid ticket type: ${ticket.ticketTypeId}`);
            }
            if (ticketType.soldCount + ticket.quantity > ticketType.capacity) {
              throw new Error(
                `Not enough tickets available for ${ticketType.name}.`
              );
            }
            ticketType.soldCount += ticket.quantity;
          }
          await (listingDoc as MovieDocument).save({ session: sessionDB });
        } else if (body.type === "leisure") {
          // Leisure listing validation (if applicable)

          listingDoc = (await Leisure.findById(body.listing).session(
            sessionDB
          )) as LeisureDocument | null;
          if (!listingDoc) {
            throw new Error("Leisure not found.");
          }

          if (
            !("tickets" in body.details) ||
            !Array.isArray(body.details.tickets) ||
            body.details.tickets.length === 0
          ) {
            throw new Error("Leisure bookings require at least one ticket.");
          }

          for (const ticket of body.details.tickets) {
            const ticketType = (listingDoc as LeisureDocument).tickets.find(
              (t: LeisureTicketType) => t._id.toString() === ticket.ticketTypeId
            );
            if (!ticketType) {
              throw new Error(`Invalid ticket type: ${ticket.ticketTypeId}`);
            }
            if (ticketType.soldCount + ticket.quantity > ticketType.capacity) {
              throw new Error(
                `Not enough tickets available for ${ticketType.name}.`
              );
            }
            ticketType.soldCount += ticket.quantity;
          }
          await (listingDoc as LeisureDocument).save({ session: sessionDB });
          // throw new Error(`Listing type ${body.type} not fully implemented.`);
        } else {
          throw new Error(`Listing type ${body.type} not supported.`);
        }

        // Fetch and apply coupon
        const coupon = body.couponCode
          ? await getCoupon(body.couponCode)
          : null;
        if (body.couponCode && !coupon) {
          throw new Error("Invalid coupon code");
        }

        // Calculate totals
        const { subtotal, serviceFee, totalAmount } = await calculateTotals(
          body.details,
          body.type,
          coupon,
          body.listing,
          sessionDB
        );

        const bookingCode = await generateBookingCode(listingDoc?.title);

        // Create booking
        const newBooking = new Booking({
          explorer,
          type: body.type,
          listing: body.listing,
          details: body.details,
          totalAmount,
          serviceFee: serviceFee, // Use calculated service fee
          coupon: {
            code: body.couponCode,
            discount: coupon
              ? coupon.type === "percentage"
                ? (coupon.value / 100) * subtotal
                : coupon.value
              : 0,
            applied: !!body.couponCode,
          },
          status: "pending",
          paymentStatus: "pending",
          payment: null,
          code: bookingCode,
        });

        await newBooking.save({ session: sessionDB });
        return newBooking;
      });

      // Populate explorer for response
      await booking.populate("explorer");
      let paymentId = null;

      // Initialize payment after booking is created
      try {
        // Get vendor ID for split payment
        let vendorId;
        if (body.type === "leisure") {
          const { Leisure } = await import("@/models/leisure");
          const leisure = await Leisure.findById(booking.listing);
          vendorId = leisure?.vendor;
        } else if (body.type === "events") {
          const { Event } = await import("@/models/event");
          const event = await Event.findById(booking.listing);
          vendorId = event?.vendor;
        } else if (body.type === "movies_and_cinema") {
          const Movie = (await import("@/models/movie")).default;
          const movie = await Movie.findById(booking.listing).populate(
            "cinema"
          );
          vendorId = movie?.cinema?.vendor;
        }

        const paymentInitData = {
          bookingId: booking._id.toString(),
          amount: booking.totalAmount,
          email: session.user.email,
          customerName: session.user.firstName + " " + session.user.lastName,
          bookingType: body.type,
          vendorId: vendorId,
        };

        const paymentResult = await initializePayment(paymentInitData);

        if (paymentResult.success) {
          paymentData = paymentResult.data;

          // Create payment document in database
          const { Payment } = await import("@/models/payment");
          const paymentDoc = new Payment({
            bookingId: booking._id,
            vendor: vendorId,
            explorer: booking.explorer,
            paystackReference: paymentData?.reference,
            amount: booking.totalAmount,
            currency: "NGN",
            status: "pending",
            paymentMethod: "paystack",
            customerEmail: session.user.email,
            customerName: session.user.firstName + " " + session.user.lastName, // We'll get this from the form later
            metadata: {
              bookingType: body.type,
              isSplitPayment: true,
              // subaccountId: paymentData?.subaccountId,
              // commissionRate: paymentData?.commissionRate,
              paystackAccessCode: paymentData?.access_code,
              paystackAuthorizationUrl: paymentData?.authorization_url,
            },
          });

          try {
            await paymentDoc.save({ session: sessionDB });

            // Update booking with payment reference
            booking.payment = paymentDoc._id;
            await booking.save({ session: sessionDB });

            // Add payment ID to response
            // paymentData.paymentId = paymentDoc._id.toString();
            paymentId = paymentDoc._id.toString();
          } catch (paymentError) {
            console.error("Error saving payment document:", paymentError);
            // Don't fail the entire booking if payment document creation fails
            // The webhook can still process the payment using the reference
          }
        } else {
          console.error("Payment initialization failed:", paymentResult.error);
          // If payment initialization fails, we should still return the booking
          // but without payment data
        }
      } catch (error) {
        console.error("Error initializing payment:", error);
        // Continue without payment initialization if it fails
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            id: booking._id,
            explorer: booking.explorer,
            type: booking.type,
            listing: booking.listing,
            details: booking.details,
            totalAmount: booking.totalAmount,
            serviceFee: booking.serviceFee,
            status: booking.status,
            createdAt: booking.createdAt,
            code: booking.code,
            payment: paymentData, // Include payment data for modal
            paymentId: paymentId,
          },
          message: "Booking successful",
        },
        { status: 201 }
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create booking.";
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "BOOKING_FAILED",
          message: errorMessage,
        },
        { status: errorMessage.includes("not found") ? 404 : 400 }
      );
    } finally {
      sessionDB.endSession();
    }
  } catch (error: unknown) {
    console.error("Booking creation error:", error);
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

    if (!session.user.role || !["explorer"].includes(session.user.role)) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "FORBIDDEN",
          message:
            "You don't have permission to view bookings. Please contact support if you believe this is an error.",
        },
        { status: 403 }
      );
    }

    await connectToDB();
    const explorer = session.user.id;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const type = searchParams.get("type") || undefined;
    const search = searchParams.get("search") || undefined;

    if (!type) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "INVALID_TYPE",
          message: "Booking type required.",
        },
        { status: 400 }
      );
    }

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

    const query: Record<string, unknown> = { explorer };

    if (type) {
      query.type = type;
    }

    if (search) {
      query.code = { $regex: search, $options: "i" };
    }

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Booking.countDocuments(query),
    ]);

    const formattedBookings = await Promise.all(
      bookings.map(async (booking) => {
        let listing: {
          _id: mongoose.Types.ObjectId;
          title: string;
          slug?: string;
          images?: string[];
          accommodationType?: string;
        } | null = null;

        if (booking.type === "events") {
          const eventDoc = await Event.findById(booking.listing)
            .select("title slug images")
            .lean();
          listing = eventDoc as typeof listing;
        } else if (booking.type === "accommodations") {
          const accommodationDoc = await Accommodation.findById(booking.listing)
            .select("title slug images accommodationType")
            .lean();
          listing = accommodationDoc as typeof listing;
        } else if (booking.type === "leisure") {
          // listing = await Leisure.findById(booking.listing)
          //   .select("name")
          //   .lean();
        } else if (booking.type === "movies_and_cinema") {
          // listing = await Movie.findById(booking.listing)
          //   .select("title")
          //   .lean();
        }

        return {
          ...booking,
          listing: listing
            ? {
                _id: (listing as ListingDetails)._id,
                title: (listing as ListingDetails).title,
                slug: (listing as ListingDetails).slug,
                images: (listing as ListingDetails).images || [],
                accommodationType: (listing as ListingDetails).accommodationType,
              }
            : {
                _id: booking.listing.toString(),
                title: "Unknown",
                accommodationType: "Unknown",
              },
        };
      })
    );

    return NextResponse.json(
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