export interface AdminPayment {
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
  vendor: {
    _id: string;
    firstName?: string;
    lastName?: string;
    businessName?: string;
    email: string;
    avatar?: string;
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

export interface AdminTransactionsResponse {
  success: boolean;
  data: {
    payments: AdminPayment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminTransactionsParams {
  page?: number;
  limit?: number;
  status?: "pending" | "success" | "failed" | "abandoned";
  startDate?: string;
  endDate?: string;
  search?: string;
  vendorId?: string;
  explorerId?: string;
}
