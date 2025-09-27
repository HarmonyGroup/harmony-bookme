import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ApiError,
  CreateBookingRequest,
  CreateBookingResponse,
  ExplorerBookingsResponse,
} from "@/types/booking";

export const useCreateBooking = () => {
  return useMutation<
    CreateBookingResponse,
    Error,
    CreateBookingRequest,
    unknown
  >({
    mutationFn: async (data: CreateBookingRequest) => {
      const response = await fetch("/api/explorer/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          (result as ApiError).message || "Failed to create booking"
        );
      }

      return result as CreateBookingResponse;
    },
  });
};

export function useGetExplorerBookings({
  page = 1,
  limit = 10,
  type,
  search,
}: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}) {
  return useQuery<ExplorerBookingsResponse, Error>({
    queryKey: ["explorerBookings", { page, limit, type, search }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(type && { type }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/explorer/booking?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          (result as ApiError).message || "Failed to fetch bookings"
        );
      }

      return result as ExplorerBookingsResponse;
    },
  });
}

export const useInitiateAccommodationBookingPayment = () => {
  return useMutation({
    mutationFn: async (data: { bookingId: string }) => {
      const response = await fetch("api/explorer/booking/accommodations/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          (result as ApiError).message || "Failed to initiate accommodation booking payment"
        );
      }

      return result;
    }
  })
}