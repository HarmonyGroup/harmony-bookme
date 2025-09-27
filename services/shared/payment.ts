import axios from "axios";
import { CreatePaymentRequest } from "@/types/payment";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface InitializePaymentResponse {
  success: boolean;
  data: {
    authorizationUrl: string;
    reference: string;
    accessCode: string;
  };
  message: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  data: {
    paymentId: string;
    bookingId: string;
    status: "pending" | "success" | "failed" | "abandoned";
    amount: number;
    currency: string;
    paidAt?: Date;
    paystackTransactionId: number;
  };
  message: string;
}

export const initializePayment = async (
  paymentData: CreatePaymentRequest
): Promise<InitializePaymentResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/payments/initialize`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to initialize payment"
    );
  }
};

export const verifyPayment = async (
  reference: string
): Promise<VerifyPaymentResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/payments/verify`,
      { reference },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to verify payment"
    );
  }
};

export const checkPaymentStatus = async (
  reference: string
): Promise<VerifyPaymentResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/payments/verify?reference=${reference}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to check payment status"
    );
  }
};


