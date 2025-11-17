export interface ApiError {
  success: false;
  error: string;
  message: string;
}

interface EventTicket {
  ticketTypeId: string;
  quantity: number;
}

interface MovieTicket {
  ticketTypeId: string;
  quantity: number;
}

interface LeisureTicket {
  ticketTypeId: string;
  quantity: number;
}

interface EventDetails {
  tickets: EventTicket[];
}

interface AccommodationDetails {
  checkInDate: string; // ISO date string
  checkOutDate: string; // ISO date string
  guests: number;
  roomType?: string; // room._id for hotels, undefined for shortlets
}

interface MovieDetails {
  showtime: string;
  tickets: MovieTicket[]
}

interface LeisureDetails {
  // activityDate: string; // ISO date string
  // participants: number;
  // price: number;
  tickets: LeisureTicket[];
}

type BookingDetails =
  | EventDetails
  | AccommodationDetails
  | MovieDetails
  | LeisureDetails;

export interface CreateBookingRequest {
  type: "events" | "accommodations" | "leisure" | "movies_and_cinema";
  listing: string;
  details: BookingDetails;
  couponCode?: string;
}

export interface ExplorerBooking {
  _id: string;
  explorer: { _id: string; firstName: string; lastName: string; avatar?: string; username?: string; email?: string };
  type: "events" | "accommodations" | "leisure" | "movies_and_cinema";
  listing: {
    _id: string;
    title: string;
    slug?: string;
    images?: string[];
    accommodationType?: string;
  };
  details: any;
  totalAmount: number;
  serviceFee: number;
  coupon: { code?: string; discount: number; applied: boolean };
  status: string;
  payment: PopulatedPayment | null;
  paymentStatus: string;
  paymentReference: string;
  code: string;
  vendorApproval?: {
    status: "pending" | "approved" | "rejected";
    message?: string;
    approvedAt?: string;
    rejectedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingResponse {
  success: boolean;
  data: {
    id: string;
    explorer: { _id: string; firstName: string; lastName: string; avatar?: string; username?: string };
    type: "events" | "accommodations" | "leisure" | "movies_and_cinema";
    listing: string;
    details: CreateBookingRequest["details"];
    totalAmount: number;
    serviceFee: number;
    status: string;
    createdAt: string;
    code: string;
    vendorApproval?: {
      status: "pending" | "approved" | "rejected";
      message?: string;
      approvedAt?: string;
      rejectedAt?: string;
    };
    payment?: {
      access_code: string;
      reference: string;
      paymentId: string;
    };
  };
  message: string;
}

export interface ExplorerBookingsResponse {
  success: boolean;
  data: {
    bookings: ExplorerBooking[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface PopulatedPayment {
  _id: string;
  bookingId: string;
  vendor: string;
  explorer: string;
  paystackReference: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "abandoned";
  paymentMethod: string;
  customerEmail: string;
  customerName: string;
  metadata?: any;
  paidAt?: string;
  settlementId?: string;
  settlementStatus?: "pending" | "settled" | "failed";
  vendorAmount?: number;
  platformAmount?: number;
  paystackFees?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorBookingsResponse {
  success: boolean;
  data: {
    bookings: Array<{
      _id: string;
      explorer: { _id: string; firstName: string; lastName: string; avatar?: string; username?: string };
      type: "events" | "accommodations" | "leisure" | "movies_and_cinema";
      listing: {
        _id: string;
        title: string;
        slug?: string;
        images?: string[];
      };
      details: any;
      totalAmount: number;
      serviceFee: number;
      coupon: { code?: string; discount: number; applied: boolean };
      status: string;
      payment: PopulatedPayment | null;
      paymentStatus: string;
      paymentReference: string;
      code: string;
      vendorApproval?: {
        status: "pending" | "approved" | "rejected";
        message?: string;
        approvedAt?: string;
        rejectedAt?: string;
      };
      createdAt: string;
      updatedAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
  };
}

export interface UpdateBookingStatusRequest {
  bookingId: string;
  status: string;
}

export interface UpdateBookingStatusResponse {
  success: true;
  message: string;
}

export interface VendorApprovalRequest {
  bookingId: string;
  action: "approve" | "reject";
  message?: string;
}

export interface VendorApprovalResponse {
  success: boolean;
  message: string;
}