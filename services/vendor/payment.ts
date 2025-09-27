import { useQuery } from "@tanstack/react-query";
import { VendorPaymentsResponse, VendorPaymentsParams } from "@/types/vendor/payment";

export function useGetVendorPayments({
  page = 1,
  limit = 10,
  status,
  startDate,
  endDate,
  search,
}: VendorPaymentsParams = {}) {
  return useQuery<VendorPaymentsResponse, Error>({
    queryKey: ["vendorPayments", { page, limit, status, startDate, endDate, search }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/vendor/payments?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch payments");
      }

      return result as VendorPaymentsResponse;
    },
  });
}
