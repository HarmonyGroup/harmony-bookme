import { useQuery } from "@tanstack/react-query";
import { BanksResponse } from "@/types/shared/banks";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Get banks hook
export const useGetBanks = (country: string = "nigeria") => {
  const getBanks = async (): Promise<BanksResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/shared/banks?country=${country}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  };

  return useQuery({
    queryKey: ["banks", country],
    queryFn: getBanks,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (banks don't change often)
    retry: 2,
  });
};
