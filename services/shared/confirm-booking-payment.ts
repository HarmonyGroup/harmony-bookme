import { connectToDB } from "@/lib/mongoose";
import { Payment } from "@/models/payment";
import { Booking } from "@/models/booking";
import { emitNotification } from "@/lib/notificationService";
import { Leisure } from "@/models/leisure";
import Movie from "@/models/movie";
import { Event } from "@/models/event";
import { Cinema } from "@/models/cinema";

interface ConfirmBookingPaymentData {
  bookingId: string;
  paystackData: {
    id: number;
    status: string;
    reference: string;
    paid_at: string;
    fees_split?: {
      subaccount: number;
      integration: number;
      paystack: number;
    };
    gateway_response: string;
    channel: string;
    fees_breakdown?: any;
  };
}

export async function confirmBookingPayment(data: ConfirmBookingPaymentData) {
  try {
    await connectToDB();

    const { bookingId, paystackData } = data;

    // Find the payment and booking separately
    const payment = await Payment.findOne({ bookingId });
    if (!payment) {
      throw new Error(`Payment not found for booking: ${bookingId}`);
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error(`Booking not found: ${bookingId}`);
    }

    // 1. Update payment with Paystack data
    payment.status = "success";
    payment.paidAt = new Date(paystackData.paid_at);

    // Extract split data from Paystack response
    if (paystackData.fees_split) {
      payment.vendorAmount = paystackData.fees_split.subaccount || 0;
      payment.platformAmount = paystackData.fees_split.integration || 0;
      payment.paystackFees = paystackData.fees_split.paystack || 0;
    }

    // Update payment metadata
    payment.metadata = {
      ...payment.metadata,
      paystackTransactionId: paystackData.id,
      paystackStatus: paystackData.status,
      paystackGatewayResponse: paystackData.gateway_response,
      paystackChannel: paystackData.channel,
      paystackFeesBreakdown: paystackData.fees_breakdown,
      paystackSplitData: paystackData.fees_split,
      confirmationProcessedAt: new Date(),
    };

    await payment.save();

    // 2. Update booking status
    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.paymentReference = paystackData.reference;

    await booking.save();

    // 3. Send notifications
    await sendBookingNotifications(booking);
    
    return {
      success: true,
      paymentId: payment._id,
      bookingId: booking._id,
      payment,
      booking,
    };

  } catch (error) {
    // console.error("Error confirming booking payment:", error);
    throw error;
  }
}

async function sendBookingNotifications(booking: any) {

  let listing = null;
  Movie;
  Cinema;

  if (booking.type === "leisure") {
    listing = await Leisure.findById(booking.listing);
  } else if (booking.type === "movies_and_cinema") {
    listing = await Movie.findById(booking.listing);
    console.log("movie-listing", listing);
  } else if (booking.type === "events") {
    listing = await Event.findById(booking.listing);
  }

  try {
    // Send vendor notification
    if (booking.type === "leisure") {
      // Send vendor notification
      await emitNotification("leisure.booking", {
        leisureId: booking.listing._id.toString(),
        title: booking.listing.title,
        // slug: "leisure-booking",
        vendorId: booking.listing.vendor,
        bookingId: booking._id.toString(),
      });
      // Send explorer notification
      await emitNotification("explorer.leisure.booking", {
        listingId: booking.listing.toString(),
        title: "Leisure Booking Confirmed",
        slug: "leisure-booking",
        explorerId: booking.explorer.toString(),
        bookingId: booking._id.toString(),
        bookingCode: booking.code,
        listingType: "leisure",
      });
    } else if (booking.type === "movies_and_cinema") {

      // Send vendor notification
      await emitNotification("movies_and_cinema.booking", {
        vendorId: listing.vendor,
        movieId: listing._id.toString(),
        title: listing.title,
        bookingId: booking._id.toString(),
        bookingCode: booking.code,
        // explorerId: booking.explorer.toString(),
      });

      // Send explorer notification
      await emitNotification("explorer.movies_and_cinema.booking", {
        explorerId: booking.explorer.toString(),
        listingId: listing._id.toString(),
        title: listing.title,
        slug: listing.slug,
        bookingId: booking._id.toString(),
        bookingCode: booking.code,
        listingType: "explorer_movies_and_cinema_booking",
      });
    } else if (booking.type === "events") {

      // Send vendor notification
      await emitNotification("events.booking", {
        eventId: booking.listing.toString(),
        title: "Events Booking Confirmed",
        slug: "events-booking",
        explorerId: booking.explorer.toString(),
      });

      // Send explorer notification
      await emitNotification("explorer.events.booking", {
        eventId: booking.listing.toString(),
        title: "Events Booking Confirmed",
        slug: "events-booking",
        explorerId: booking.explorer.toString(),
        bookingId: booking._id.toString(),
        bookingCode: booking.code,
        listingType: "events",
      });
    }

    // TODO: Add notifications for other booking types (events, accommodations, movies)
  } catch (error) {
    console.error("Error sending notifications:", error);
    // Don't throw error - notifications are not critical
  }
}
