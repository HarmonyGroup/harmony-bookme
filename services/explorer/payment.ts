import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

// Initialize payment for a booking
export const useInitializePayment = () => {
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await axios.post("/api/payments/initialize-booking", {
        bookingId,
      });
      return response.data;
    },
  });
};

// Verify payment
export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: async (reference: string) => {
      const response = await axios.post("/api/payments/verify", {
        reference,
      });
      return response.data;
    },
  });
};

// Get payment status
export const usePaymentStatus = (reference: string) => {
  return useQuery({
    queryKey: ["payment-status", reference],
    queryFn: async () => {
      const response = await axios.get(`/api/payments/verify?reference=${reference}`);
      return response.data;
    },
    enabled: !!reference,
  });
};
