"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ApiError,
  EventListing,
  CreateEventListingRequest,
  CreateEventListingResponse,
} from "@/types/event";
import { toast } from "sonner";

interface AdminEventsResponse {
  success: boolean;
  data: EventListing[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface UseGetAdminEventsParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  pricingType?: string;
}

export function useGetAdminEvents(params: UseGetAdminEventsParams) {
  const { page, limit, search, category, pricingType } = params;

  return useQuery<AdminEventsResponse, ApiError>({
    queryKey: ["adminEvents", page, limit, search, category, pricingType],
    queryFn: async () => {
      const urlParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(category && { category }),
        ...(pricingType && { pricingType }),
      });

      const response = await fetch(
        `/api/admin/events?${urlParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to fetch events");
      }

      return response.json();
    },
  });
}

export function useCreateAdminEventListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateEventListingRequest
    ): Promise<CreateEventListingResponse> => {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            result.message || "Please log in to create admin event listings"
          );
        }

        if (response.status === 403) {
          throw new Error(
            result.message ||
              "You don't have permission to create admin events"
          );
        }

        if (response.status === 400 || response.status === 409) {
          throw new Error(result.message || "Failed to create admin event");
        }

        throw new Error("Failed to create admin event");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
      toast.success("Admin event listing created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create admin event");
    },
  });
}

