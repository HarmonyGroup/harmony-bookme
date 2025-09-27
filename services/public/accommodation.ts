import { useQuery } from "@tanstack/react-query";
import {
  AccommodationsResponse,
  UseGetAccommodationsParams,
  ApiError,
  AccommodationResponse,
} from "@/types/public/accommodation";

export const useGetAllAccommodations = (params: UseGetAccommodationsParams) => {
  const {
    page,
    limit,
    search,
    status,
    bedrooms,
    bathrooms,
    buildingType,
    minPrice,
    maxPrice,
  } = params;

  return useQuery<AccommodationsResponse, ApiError>({
    queryKey: [
      "accommodations",
      page,
      limit,
      search,
      status,
      bedrooms,
      bathrooms,
      buildingType,
      minPrice,
      maxPrice,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (bedrooms) params.append("bedrooms", bedrooms);
      if (bathrooms) params.append("bathrooms", bathrooms);
      if (buildingType) params.append("buildingType", buildingType);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const response = await fetch(
        `/api/public/accommodations?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to fetch accommodations");
      }

      return response.json();
    },
    retry: 2,
  });
};

export const useGetAccommodation = ({ slug }: { slug: string }) => {
  return useQuery<AccommodationResponse, ApiError>({
    queryKey: ["accommodation", slug],
    queryFn: async () => {
      const response = await fetch(`/api/public/accommodations/${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to fetch accommodation");
      }
      return response.json();
    },
    enabled: !!slug,
    retry: (failureCount, error) => {
      if (error.message.includes("NOT_FOUND")) {
        return false;
      }
      return failureCount < 3;
    },
  });
};