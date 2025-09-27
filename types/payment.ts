export interface PaymentRequest {
  amount: number;
  email: string;
  reference: string;
  callback_url?: string;
  metadata?: {
    bookingId: string;
    bookingType: string;
    customerName: string;
    [key: string]: any;
  };
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaymentVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    amount: number;
    currency: string;
    source: string;
    reason: string;
    recipient: number;
    status: string;
    transfer_code: string;
    titan_code: string;
    transferred_at: string;
    idempotency: string;
    integration: number;
    fee_charged: number;
    subaccount: string;
    order_id: string;
    paid_at: string;
    paidAt: string;
    pos_transaction_data: string;
    source_details: string;
    fees_breakdown: string;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: string;
      risk_action: string;
      international_format_phone: string;
    };
    plan: string;
    split_code: string;
    subaccount_code: string;
    account_details: string;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string;
      receiver_bank_account_number: string;
      receiver_bank: string;
    };
    gateway_response: string;
    channel: string;
    ip_address: string;
    log: string;
    fees: number;
    // paidAt: string;
    requested_amount: number;
    transaction_date: string;
    plan_object: string;
    subaccount_object: string;
  };
}

export interface PaymentStatus {
  pending: "pending";
  success: "success";
  failed: "failed";
  abandoned: "abandoned";
}

export interface CreatePaymentRequest {
  bookingId: string;
  amount: number;
  email: string;
  customerName: string;
  bookingType: string;
  callbackUrl?: string;
}

export interface PaymentRecord {
  _id?: string;
  bookingId: string;
  paystackReference: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "abandoned";
  paymentMethod: string;
  customerEmail: string;
  customerName: string;
  metadata?: any;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
