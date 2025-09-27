import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface VendorPerformanceData {
  totalBookings: number;
  totalSuccessfulPayments: number;
  totalListings: number;
}

export interface VendorPerformanceResponse {
  success: boolean;
  data: VendorPerformanceData;
  message: string;
}

export interface PerformanceFilters {
  startDate?: string;
  endDate?: string;
  type?: "leisure" | "events" | "accommodations" | "movies_and_cinema";
}

const getVendorPerformance = async (
  filters?: PerformanceFilters
): Promise<VendorPerformanceResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.startDate) {
      params.append("startDate", filters.startDate);
    }
    if (filters?.endDate) {
      params.append("endDate", filters.endDate);
    }
    if (filters?.type) {
      params.append("type", filters.type);
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/vendor/performance?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch vendor performance data"
    );
  }
};

export const useGetVendorPerformance = (filters?: PerformanceFilters) => {
  return useQuery({
    queryKey: ["vendor-performance", filters],
    queryFn: () => getVendorPerformance(filters),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};
