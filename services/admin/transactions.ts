import { useQuery } from "@tanstack/react-query";
import { AdminTransactionsResponse, AdminTransactionsParams } from "@/types/admin/transactions";

export function useGetAdminTransactions({
  page = 1,
  limit = 10,
  status,
  startDate,
  endDate,
  search,
  vendorId,
  explorerId,
}: AdminTransactionsParams = {}) {
  return useQuery<AdminTransactionsResponse, Error>({
    queryKey: ["adminTransactions", { page, limit, status, startDate, endDate, search, vendorId, explorerId }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(search && { search }),
        ...(vendorId && { vendorId }),
        ...(explorerId && { explorerId }),
      });

      const response = await fetch(`/api/admin/transactions?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch transactions");
      }

      return result as AdminTransactionsResponse;
    },
  });
}
