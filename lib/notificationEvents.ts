import { NotificationAction } from "@/types/notification";

// Event registry with dynamic configuration
export const notificationEvents = {
  "booking.created": {
    type: "booking_created",
    recipients: (data: NotificationEventData) => [
      { role: "explorer", id: data.explorerId },
      { role: "vendor", id: data.vendorId },
    ],
    title: () => "New Booking",
    subtext: (data: NotificationEventData) =>
      `Booking for ${data.listingTitle || "Unknown"} confirmed`,
    template: (data: NotificationEventData) =>
      `Your ${data.listingType || "booking"} for ${
        data.listingTitle || "Unknown"
      } is confirmed!`,
    link: (data: NotificationEventData) => `/bookings/${data.bookingId}`,
    action: () => [], // No actions for booking confirmation
    metadata: (data: NotificationEventData) => ({
      bookingId: data.bookingId,
      listingId: data.listingId,
      listingType: data.listingType,
    }),
  },
  "booking.request": {
    type: "booking_request",
    recipients: (data: NotificationEventData) => [
      { role: "vendor", id: data.vendorId },
    ],
    title: () => "New Booking Request",
    subtext: (data: NotificationEventData) =>
      `Request for ${data.listingTitle || "Unknown"} received`,
    template: (data: NotificationEventData) =>
      `A new booking request for ${
        data.listingTitle || "Unknown"
      } has been received.`,
    link: (data: NotificationEventData) => `/bookings/${data.bookingId}`,
    action: (data: NotificationEventData): NotificationAction[] => [
      { title: "Accept", url: `/api/bookings/${data.bookingId}/accept` },
      { title: "Reject", url: `/api/bookings/${data.bookingId}/reject` },
    ],
    metadata: (data: NotificationEventData) => ({
      bookingId: data.bookingId,
      listingId: data.listingId,
      listingType: data.listingType,
    }),
  },
  "gift.won": {
    type: "gift_won",
    recipients: (data: NotificationEventData) => [
      { role: "explorer", id: data.explorerId },
    ],
    title: () => "Gift Won!",
    subtext: (data: NotificationEventData) =>
      `You received a ${data.giftName || "gift"}`,
    template: (data: NotificationEventData) =>
      `Congratulations! You won a ${data.giftName || "gift"}!`,
    link: (data: NotificationEventData) => `/gifts/${data.giftId}`,
    action: () => [],
    metadata: (data: NotificationEventData) => ({
      giftId: data.giftId,
    }),
  },
  "company.update": {
    type: "company_update",
    recipients: (data: NotificationEventData) => [
      { role: "vendor", id: data.vendorId },
    ],
    title: () => "Company Update",
    subtext: () => "New company news available",
    template: (data: NotificationEventData) =>
      data.message || "New company update available!",
    link: () => null, // No link for company updates
    action: () => [],
    metadata: () => ({}),
  },
  "payment.receipt": {
    type: "payment_receipt",
    recipients: (data: NotificationEventData) => [
      { role: "explorer", id: data.explorerId },
    ],
    title: () => "Payment Received",
    subtext: (data: NotificationEventData) =>
      `Payment for ${data.listingTitle || "booking"} processed`,
    template: (data: NotificationEventData) =>
      `Payment of ${data.amount || "0"} for ${
        data.listingTitle || "booking"
      } received!`,
    link: (data: NotificationEventData) => `/payments/${data.paymentId}`,
    action: () => [],
    metadata: (data: NotificationEventData) => ({
      paymentId: data.paymentId,
      bookingId: data.bookingId,
    }),
  },
  "event.created": {
    type: "event_created",
    recipients: (data: NotificationEventData) => [
      { role: "vendor", id: data.vendorId },
    ],
    title: () => "New Event",
    subtext: () => "Your event is ready for bookings!",
    template: (data: NotificationEventData) =>
      `Your event ${data.title || "Unknown"} has been successfully published.`,
    link: (data: NotificationEventData) => `/vendor/events/${data.slug}`,
    action: () => [],
    metadata: (data: NotificationEventData) => ({
      eventId: data.eventId,
      slug: data.slug,
    }),
  },
  "accommodation.created": {
    type: "accommodation_created",
    recipients: (data: NotificationEventData) => [
      { role: "vendor", id: data.vendorId },
    ],
    title: () => "New Accommodation",
    subtext: () => "Your accommodation is ready for bookings!",
    template: (data: NotificationEventData) =>
      `Your accommodation ${
        data.title || "Unknown"
      } has been successfully published.`,
    link: (data: NotificationEventData) =>
      `/vendor/accommodations/${data.slug}`,
    action: () => [],
    metadata: (data: NotificationEventData) => ({
      accommodationId: data.accommodationId,
      slug: data.slug,
    }),
  },
  "password.updated": {
    type: "password_updated",
    recipients: (data: NotificationEventData) => [
      { role: "explorer", id: data.userId },
    ],
    title: () => "Password Updated",
    subtext: () => "Your account password has been changed",
    template: () => "Your password has been successfully updated.",
    link: () => null,
    action: () => [],
    metadata: (data: NotificationEventData) => ({
      userId: data.userId,
    }),
  },
  "leisure.created": {
    type: "leisure_created",
    recipients: (data: NotificationEventData) => [
      { role: "vendor", id: data.vendorId },
    ],
    title: () => "New Leisure",
    subtext: () => "Your leisure activity is ready for bookings!",
    template: (data: NotificationEventData) =>
      `Your leisure ${data.title || "Unknown"} has been successfully published.`,
    link: (data: NotificationEventData) => `/vendor/leisure/${data.slug}`,
    action: () => [],
    metadata: (data: NotificationEventData) => ({
      leisureId: data.leisureId,
      slug: data.slug,
    }),
  },
  "leisure.booking": {
    type: "leisure_booking",
    recipients: (data: NotificationEventData) => [
      { role: "vendor", id: data.vendorId },
    ],
    title: () => "New Booking",
    subtext: () =>
    "You have received a new booking",
    template: (data: NotificationEventData) =>
      `Your have received a new booking for ${data.title || "Unknown"}. Click here to view booking details.`,
    link: (data: NotificationEventData) => `/vendor/bookings?bookingId=${data.bookingId}`,
    action: () => [],
    metadata: (data: NotificationEventData) => ({
      leisureId: data.leisureId,
      title: data.title,
      slug: data.slug,
      vendorId: data.vendorId,
      bookingId: data.bookingId,
    }),
  },
  "explorer.leisure.booking": {
    type: "explorer_leisure_booking",
    recipients: (data: NotificationEventData) => [
      { role: "explorer", id: data.explorerId },
    ],
    title: (data: NotificationEventData) => `Booking Confirmed - ${data.bookingCode || "Unknown"}`,
    subtext: (data: NotificationEventData) =>
      `Your booking for ${data.title || "Unknown"} is confirmed`,
    template: (data: NotificationEventData) =>
      `Your booking for ${data.title || "Unknown"} is confirmed. Click here to view booking details.`,
    link: (data: NotificationEventData) => `/bookings/${data.bookingId}`,
    action: () => [],
    metadata: (data: NotificationEventData) => ({
      listingId: data.listingId,
      title: data.title,
      slug: data.slug,
      explorerId: data.explorerId,
      bookingId: data.bookingId,
      bookingCode: data.bookingCode,
      listingType: data.listingType,
    }),
  },
  "movies_and_cinema.booking": {
    type: "movies_and_cinema_booking",
    recipients: (data: NotificationEventData) => [
      { role: "vendor", id: data.vendorId },
    ],
    title: (data: NotificationEventData) => `New Booking - ${data.bookingCode || "Unknown"}`,
    subtext: () =>
    "You have received a new booking",
    template: (data: NotificationEventData) =>
      `Your have received a new booking for ${data.title || "Unknown"}. Click here to view booking details.`,
    link: (data: NotificationEventData) => `/vendor/bookings?bookingId=${data.bookingId}`,
    action: () => [],
    metadata: (data: NotificationEventData) => ({
      vendorId: data.vendorId,
      movieId: data.movieId,
      title: data.title,
      bookingId: data.bookingId,
      bookingCode: data.bookingCode,
    }),
  },
  "explorer.movies_and_cinema.booking": {
    type: "explorer_movies_and_cinema_booking",
    recipients: (data: NotificationEventData) => [
      { role: "explorer", id: data.explorerId },
    ],
    title: (data: NotificationEventData) => `Booking Confirmed - ${data.bookingCode || "Unknown"}`,
    subtext: (data: NotificationEventData) =>
      `Your booking for ${data.title || "Unknown"} is confirmed`,
    template: (data: NotificationEventData) =>
      `Your booking for ${data.title || "Unknown"} is confirmed. Click here to view booking details.`,
    link: (data: NotificationEventData) => `/bookings/${data.bookingId}`,
    action: () => [],
    metadata: (data: NotificationEventData) => ({
      explorerId: data.explorerId,
      listingId: data.listingId,
      title: data.title,
      slug: data.slug,
      bookingId: data.bookingId,
      bookingCode: data.bookingCode,
      listingType: data.listingType,
    }),
  },
  "events.booking": {
    type: "events_booking",
    recipients: (data: NotificationEventData) => [
      { role: "vendor", id: data.vendorId },
    ],
    title: (data: NotificationEventData) => `New Booking - ${data.bookingCode || "Unknown"}`,
    subtext: () =>
    "You have received a new booking",
    template: (data: NotificationEventData) =>
      `Your have received a new booking for ${data.title || "Unknown"}. Click here to view booking details.`,
    link: (data: NotificationEventData) => `/vendor/bookings?bookingId=${data.bookingId}`,
    action: () => [],
    metadata: (data: NotificationEventData) => ({
      vendorId: data.vendorId,
      eventId: data.eventId,
      title: data.title,
      bookingId: data.bookingId,
      bookingCode: data.bookingCode,
    }),
  },
  "explorer.events.booking": {
    type: "explorer_events_booking",
    recipients: (data: NotificationEventData) => [
      { role: "explorer", id: data.explorerId },
    ],
    title: (data: NotificationEventData) => `Booking Confirmed - ${data.bookingCode || "Unknown"}`,
    subtext: (data: NotificationEventData) =>
      `Your booking for ${data.title || "Unknown"} is confirmed`,
    template: (data: NotificationEventData) =>
      `Your booking for ${data.title || "Unknown"} is confirmed. Click here to view booking details.`,
    link: (data: NotificationEventData) => `/bookings/${data.bookingId}`,
    action: () => [],
    metadata: (data: NotificationEventData) => ({
      explorerId: data.explorerId,
      eventId: data.eventId,
      title: data.title,
      slug: data.slug,
      bookingId: data.bookingId,
      bookingCode: data.bookingCode,
      listingType: data.listingType,
    }),
  },
};

// Event data interface
export interface NotificationEventData {
  [key: string]: unknown; // Flexible for any data
  explorerId?: string;
  vendorId?: string;
  listingId?: string;
  listingType?: string;
  listingTitle?: string;
  giftId?: string;
  giftName?: string;
  paymentId?: string;
  amount?: string;
  message?: string;
  recipientIds?: string[];
  eventId?: string;
  accommodationId?: string;
  title?: string;
  slug?: string;
  userId?: string;
  bookingId?: string;
  bookingCode?: string;
}