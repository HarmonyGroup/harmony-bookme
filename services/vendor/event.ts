"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type {
  CreateEventListingRequest,
  CreateEventListingResponse,
  ApiError,
  EventListing,
} from "@/types/event";
import { useQuery } from "@tanstack/react-query";

interface VendorEventsResponse {
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

interface VendorEventResponse {
  success: boolean;
  data: EventListing;
  message: string;
}

interface UseGetVendorEventsParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  pricingType?: string ;
}

interface DeleteEventResponse {
  success: boolean;
  message: string;
}

export function useCreateEventListing() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (
      data: CreateEventListingRequest
    ): Promise<CreateEventListingResponse> => {
      const response = await fetch("/api/vendor/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error(
            result.message || "Please log in to create event listings"
          );
        }
        if (response.status === 403) {
          throw new Error(
            result.message || "You don't have permission to create events"
          );
        }
        throw new Error(result.message || "Failed to create event listing");
      }

      return result;
    },
    onSuccess: (data) => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: ["events"] });

      // Show success toast
      toast.success("Event listing created successfully!");

      // Redirect to the created event page
      router.push(`/vendor/events`);
    },
    onError: (error: Error) => {
      // Show error toast with specific messaging
      toast.error(error.message || "Failed to create event");
    },
  });
}

export function useGetVendorEvents(params: UseGetVendorEventsParams) {
  const { page, limit, search, category, pricingType } = params;

  return useQuery<VendorEventsResponse, ApiError>({
    queryKey: ["vendorEvents", page, limit, search, category, pricingType],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(category && { category }),
        ...(pricingType && { pricingType }),
      });

      const response = await fetch(`/api/vendor/events?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to fetch vendor events");
      }

      return response.json();
    },
  });
}

export function useGetVendorEvent({ slug }: { slug: string }) {
  return useQuery<VendorEventResponse, ApiError>({
    queryKey: ['vendorEvent', slug],
    queryFn: async () => {
      const response = await fetch(`/api/vendor/event/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || 'Failed to fetch event');
      }

      return response.json();
    },
    enabled: !!slug,
    retry: (failureCount, error) => {
      if (error.message.includes('UNAUTHORIZED') || error.message.includes('NOT_FOUND')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useDeleteVendorEvent() {
  const queryClient = useQueryClient();
  return useMutation<DeleteEventResponse, ApiError, string>({
    mutationFn: async (eventId: string) => {
      const response = await fetch(`/api/vendor/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to delete event");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorEvents"] });
    },
    onError: (error) => {
      console.error("Error deleting event:", error.message);
    },
  });
};