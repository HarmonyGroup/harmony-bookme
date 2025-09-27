export interface ApiError {
  success: false;
  error: string;
  message: string;
}

// Notification types for different events
export type NotificationType =
  | "booking_created"
  | "booking_cancelled"
  | "event_reminder"
  | "coupon_applied"
  | "vendor_newBooking"
  | "vendor_bookingCancelled"
  | "vendor_eventNearingCapacity"
  | "event_created"
  | "accommodation_created"

export interface NotificationAction {
  title: string;
  url: string;
}

// Notification interface for MongoDB documents
export interface Notification {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  subtext: string;
  content: string;
  link?: string;
  action?: NotificationAction[];
  // metadata: {
  //   bookingId?: string;
  //   listingId?: string;
  //   eventTitle?: string;
  //   [key: string]: any;
  // };
  metadata: Record<string, any>;
  status: "unread" | "read";
  createdAt: string;
  isActive: boolean;
}

// API response for fetching notifications
export interface NotificationsResponse {
  success: true;
  data: Notification[];
  total: number;
}