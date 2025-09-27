import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateAccommodationListingRequest,
  CreateAccommodationListingResponse,
  UpdateAccommodationStatusRequest,
  UpdateAccommodationStatusResponse,
} from "@/types/accommodation";
import {
  UseGetVendorAccommodationsParams,
  VendorAccommodationsResponse,
  DeleteAccommodationResponse,
  ApiError,
} from "@/types/vendor/accommodation";

export function useCreateAccommodationListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateAccommodationListingRequest
    ): Promise<CreateAccommodationListingResponse> => {
      const response = await fetch("/api/vendor/accommodations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create accommodation listing"
        );
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendorAccommodations"] });
    },
  });
}

export const useGetVendorAccommodations = (
  params: UseGetVendorAccommodationsParams
) => {
  const { page, limit, search } = params;
  return useQuery<VendorAccommodationsResponse, ApiError>({
    queryKey: ["vendorAccommodations", page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(
        `/api/vendor/accommodations?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch vendor accommodations"
        );
      }

      return response.json();
    },
  });
};

export const useDeleteVendorAccommodation = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteAccommodationResponse, ApiError, string>({
    mutationFn: async (eventId: string) => {
      const response = await fetch(`/api/vendor/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to delete event");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorAccommodations"] });
    },
    onError: (error) => {
      console.error("Error deleting event:", error.message);
    },
  });
};

export const useUpdateAccommodationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateAccommodationStatusResponse,
    ApiError,
    UpdateAccommodationStatusRequest
  >({
    mutationFn: async (data) => {
      const response = await fetch(`/api/vendor/accommodations/update-status`, {
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

      return result as UpdateAccommodationStatusResponse;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["vendorAccommodations"] });
      queryClient.invalidateQueries({
        queryKey: ["accommodation", response.data._id],
      });
    },
  });
};