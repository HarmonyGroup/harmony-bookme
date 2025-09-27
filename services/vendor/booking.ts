import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ApiError,
  UpdateBookingStatusResponse,
  UpdateBookingStatusRequest,
  VendorBookingsResponse,
  VendorApprovalRequest,
  VendorApprovalResponse,
} from "@/types/booking";

export function useGetVendorBookings({
  page = 1,
  limit = 10,
  type,
  search,
  status,
  startDate,
  endDate,
}: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery<VendorBookingsResponse, Error>({
    queryKey: ["vendorBookings", { page, limit, type, search, status, startDate, endDate }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(type && { type }),
        ...(search && { search }),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`/api/vendor/booking?${params}`, {
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

      return result as VendorBookingsResponse;
    },
  });
}

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateBookingStatusResponse,
    ApiError,
    UpdateBookingStatusRequest
  >({
    mutationFn: async (data) => {
      const response = await fetch(`/api/vendor/booking/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result as ApiError;
      }

      return result as UpdateBookingStatusResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorBookings"] });
    },
  });
};

export const useHandleBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<
    VendorApprovalResponse,
    ApiError,
    VendorApprovalRequest
  >({
    mutationFn: async (data) => {
      const response = await fetch(`/api/vendor/booking/request`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result as ApiError;
      }

      return result as VendorApprovalResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorBookings"] });
    },
  });
};