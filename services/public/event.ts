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

interface EventsResponse {
  success: boolean;
  data: EventListing[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface EventResponse {
  success: boolean;
  data: EventListing;
  message: string;
}

interface UseGetEventsParams {
  page: number;
  limit: number;
  search: string;
  category: string;
  pricingType: string;
  eventFormat: string;
  date: Date | undefined;
}

export const useGetAllEvents = (params: UseGetEventsParams) => {
  const { page, limit, search, category, pricingType, eventFormat, date } =
    params;

  return useQuery<EventsResponse, ApiError>({
    queryKey: [
      "events",
      page,
      limit,
      search,
      category,
      pricingType,
      eventFormat,
      date?.toISOString(),
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (pricingType) params.append("pricingType", pricingType);
      if (eventFormat) params.append("format", eventFormat);
      if (date) params.append("date", date.toISOString().split("T")[0]);

      const response = await fetch(`/api/public/events?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to fetch events");
      }

      return response.json();
    },
    retry: 2,
  });
};

export const useGetEvent = ({ slug }: { slug: string }) => {
  return useQuery<EventResponse, ApiError>({
    queryKey: ["event", slug],
    queryFn: async () => {
      const response = await fetch(`/api/public/events/${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to fetch event");
      }

      return response.json();
    },
    enabled: !!slug,
    retry: (failureCount, error) => {
      if (
        error.message.includes("UNAUTHORIZED") ||
        error.message.includes("NOT_FOUND")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
};