import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface PaystackTransactionDetails {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: string;
  log: {
    start_time: number;
    time_spent: number;
    attempts: number;
    errors: number;
    success: boolean;
    mobile: boolean;
    input: any[];
    history: Array<{
      type: string;
      message: string;
      time: number;
    }>;
  };
  fees: number;
  fees_split: any;
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
    account_name: string | null;
  };
  customer: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    customer_code: string;
    phone: string | null;
    metadata: any;
    risk_action: string;
    international_format_phone: string | null;
  };
  plan: any;
  split: {
    subaccounts?: Array<{
      subaccount: string;
      share: number;
    }>;
    bearer_type?: string;
    bearer_subaccount?: string;
  };
  order_id: any;
  paidAt: string;
  createdAt: string;
  requested_amount: number;
  pos_transaction_data: any;
  source: any;
  fees_breakdown: any;
  connect: any;
  transaction_date: string;
  plan_object: any;
  subaccount: any;
}

export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: PaystackTransactionDetails;
}

export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerificationResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key is not configured');
  }

  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error verifying Paystack transaction:', error.response?.data || error.message);
    throw new Error(`Failed to verify transaction: ${error.response?.data?.message || error.message}`);
  }
}

export function extractSplitData(transactionData: PaystackTransactionDetails) {
  const split = transactionData.split || {};
  const subaccounts = split.subaccounts || [];
  const bearerType = split.bearer_type;
  const bearerSubaccount = split.bearer_subaccount;
  
  return {
    split,
    subaccounts,
    bearerType,
    bearerSubaccount,
    fees: transactionData.fees || 0,
    feesSplit: transactionData.fees_split,
    feesBreakdown: transactionData.fees_breakdown,
  };
}

