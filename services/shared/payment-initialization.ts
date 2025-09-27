import axios from 'axios';
import User from '@/models/users';
import Configuration from '@/models/configuration';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface PaymentInitializationData {
  bookingId: string;
  amount: number;
  email: string;
  customerName: string;
  bookingType: string;
  vendorId?: string;
}

export interface PaymentInitializationResponse {
  success: boolean;
  data?: {
    access_code: string;
    reference: string;
    // paymentId: string;
    authorization_url: string;
  };
  error?: string;
}

export async function initializePayment(data: PaymentInitializationData): Promise<PaymentInitializationResponse> {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key is not configured');
    }

    // Get vendor information for split payment
    let subaccountId;
    let isSplitPayment = false;
    let commissionRate = 3; // Default fallback

    if (data.vendorId) {
      const vendor = await User.findById(data.vendorId);
      if (vendor && vendor.paystackSubaccount?.subaccountId && vendor.paystackSubaccount?.status === "active") {
        subaccountId = vendor.paystackSubaccount.subaccountId;
        isSplitPayment = true;

        // Get commission rate
        const config = await Configuration.findOne({ isActive: true });
        if (config) {
          const standardCommissionRate = config.commissionRates[vendor.vendorAccountPreference as keyof typeof config.commissionRates];
          const customRate = vendor.commissionRate;
          commissionRate = customRate !== null && customRate !== undefined ? customRate : (standardCommissionRate || 3);
        }
      }
    }

    // Prepare Paystack request
    const paystackRequest: any = {
      email: data.email,
      amount: data.amount * 100, // Convert to kobo
      metadata: {
        bookingId: data.bookingId,
        bookingType: data.bookingType,
        customerName: data.customerName,
        commissionRate: commissionRate.toString(),
        custom_fields: [
          {
            display_name: "Booking Type",
            variable_name: "booking_type",
            value: data.bookingType,
          },
        ],
      },
    };

    // Add split payment configuration if applicable
    if (isSplitPayment && subaccountId) {
      paystackRequest.subaccount = subaccountId;
      paystackRequest.bearer = "subaccount"; // Vendor pays Paystack fees
    }

    // Initialize Paystack payment
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      paystackRequest,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status) {
      return {
        success: true,
        data: {
          access_code: response.data.data.access_code,
          reference: response.data.data.reference,
          authorization_url: response.data.data.authorization_url,
          // paymentId: response.data.data.reference, // We'll use reference as paymentId for now
        },
      };
    } else {
      throw new Error(response.data.message || "Failed to initialize payment");
    }
  } catch (error: any) {
    console.error("Payment initialization error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Failed to initialize payment",
    };
  }
}
