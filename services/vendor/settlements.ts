import { useQuery } from "@tanstack/react-query";

// Types
interface GetSettlementsParams {
  page?: number;
  limit?: number;
  status?: "pending" | "success" | "failed" | "cancelled";
  startDate?: string;
  endDate?: string;
}

interface SettlementStats {
  totalSettlements: number;
  totalAmount: number;
  pendingSettlements: number;
  pendingAmount: number;
  successfulSettlements: number;
  successfulAmount: number;
  failedSettlements: number;
  failedAmount: number;
  pendingPaymentsCount: number;
  pendingPaymentsAmount: number;
}

// API Functions
const getSettlements = async (params: GetSettlementsParams = {}) => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.status) searchParams.append("status", params.status);
  if (params.startDate) searchParams.append("startDate", params.startDate);
  if (params.endDate) searchParams.append("endDate", params.endDate);

  const response = await fetch(`/api/vendor/settlements?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch settlements");
  }
  
  return response.json();
};

const getSettlementDetails = async (settlementId: string) => {
  const response = await fetch(`/api/vendor/settlements/${settlementId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch settlement details");
  }
  
  return response.json();
};

const getSettlementStats = async (): Promise<{ success: boolean; data: SettlementStats }> => {
  const response = await fetch("/api/vendor/settlements/stats");
  
  if (!response.ok) {
    throw new Error("Failed to fetch settlement stats");
  }
  
  return response.json();
};

// React Query Hooks
export const useGetSettlements = (params: GetSettlementsParams = {}) => {
  return useQuery({
    queryKey: ["settlements", params],
    queryFn: () => getSettlements(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetSettlementDetails = (settlementId: string) => {
  return useQuery({
    queryKey: ["settlement", settlementId],
    queryFn: () => getSettlementDetails(settlementId),
    enabled: !!settlementId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetSettlementStats = () => {
  return useQuery({
    queryKey: ["settlement-stats"],
    queryFn: getSettlementStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
