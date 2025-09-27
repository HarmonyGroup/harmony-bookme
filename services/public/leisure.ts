import { useQuery } from "@tanstack/react-query";
import {
  UseGetLeisuresParams,
  LeisureListingsResponse,
  ApiError,
  LeisureResponse,
} from "@/types/public/leisure";

export const useGetAllLeisures = (params: UseGetLeisuresParams) => {
  const { page, limit, search } = params;

  return useQuery<LeisureListingsResponse, ApiError>({
    queryKey: ["leisure", page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);

      const response = await fetch(`/api/public/leisure?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch leisure listings"
        );
      }

      return response.json();
    },
  });
};

export const useGetLeisure = ({ slug }: { slug: string }) => {
  return useQuery<LeisureResponse, ApiError>({
    queryKey: ["leisure", slug],
    queryFn: async () => {
      const response = await fetch(`/api/public/leisure/${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to fetch leisure");
      }
      return response.json();
    },
    enabled: !!slug,
  });
};