// Settlement Management Types

export interface Settlement {
  _id: string;
  settlementId: string;
  vendor: {
    _id: string;
    businessName: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "cancelled";
  settlementDate: Date;
  settlementBank: string;
  settlementAccount: string;
  paystackData: {
    settlementId: string;
    amount: number;
    status: string;
    settlementDate: string;
    settlementBank: string;
    settlementAccount: string;
    settlementSchedule: string;
  };
  payments: PaymentSettlement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentSettlement {
  _id: string;
  bookingId: string;
  paystackReference: string;
  amount: number;
  vendorAmount: number;
  platformAmount: number;
  customerName: string;
  customerEmail: string;
  paidAt: Date;
  booking: {
    _id: string;
    code: string;
    type: string;
    totalAmount: number;
    details: any;
  };
}

// API Request Types
export interface GetSettlementsRequest {
  page?: number;
  limit?: number;
  status?: "pending" | "success" | "failed" | "cancelled";
  vendorId?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetSettlementDetailsRequest {
  settlementId: string;
}

// API Response Types
export interface GetSettlementsResponse {
  success: boolean;
  data: {
    settlements: Settlement[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message?: string;
}

export interface GetSettlementDetailsResponse {
  success: boolean;
  data: Settlement;
  message?: string;
}

export interface SettlementStatsResponse {
  success: boolean;
  data: {
    totalSettlements: number;
    totalAmount: number;
    pendingSettlements: number;
    pendingAmount: number;
    successfulSettlements: number;
    successfulAmount: number;
    failedSettlements: number;
    failedAmount: number;
  };
  message?: string;
}

// Webhook Types
export interface SettlementWebhookData {
  id: string;
  amount: number;
  status: string;
  settlement_date: string;
  settlement_bank: string;
  settlement_account: string;
  settlement_schedule: string;
  subaccount?: string;
}
