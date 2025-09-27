import { useQuery } from "@tanstack/react-query";
import { useGetConfigurationResponse } from "@/types/admin/configuration";

const API_BASE_URL = "/api/admin/configuration";

export const useGetConfiguration = () => {
  return useQuery({
    queryKey: ["configuration"],
    queryFn: async (): Promise<useGetConfigurationResponse> => {
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch configuration");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
