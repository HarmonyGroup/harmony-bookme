export interface VendorPayment {
  _id: string;
  bookingId: {
    _id: string;
    type: "events" | "accommodations" | "leisure" | "movies_and_cinema";
    listing: {
      _id: string;
      title: string;
      slug?: string;
    };
    code: string;
  };
  explorer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  paystackReference: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "abandoned";
  paymentMethod: string;
  customerEmail: string;
  customerName: string;
  metadata?: any;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorPaymentsResponse {
  success: boolean;
  data: {
    payments: VendorPayment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface VendorPaymentsParams {
  page?: number;
  limit?: number;
  status?: "pending" | "success" | "failed" | "abandoned";
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface PaymentStatus {
  value: "pending" | "success" | "failed" | "abandoned";
  label: string;
  colorClass: string;
}

export const PAYMENT_STATUSES: PaymentStatus[] = [
  {
    value: "pending",
    label: "Pending",
    colorClass: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "success",
    label: "Success",
    colorClass: "bg-green-100 text-green-800",
  },
  {
    value: "failed",
    label: "Failed",
    colorClass: "bg-red-100 text-red-800",
  },
  {
    value: "abandoned",
    label: "Abandoned",
    colorClass: "bg-gray-100 text-gray-800",
  },
];

export const PAYMENT_STATUS_MAP: Record<PaymentStatus["value"], PaymentStatus> =
  Object.fromEntries(
    PAYMENT_STATUSES.map((status) => [status.value, status])
  ) as Record<PaymentStatus["value"], PaymentStatus>;
