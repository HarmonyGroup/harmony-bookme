import { ApiError } from "@/types/accommodation";
import {
  UpdatePersonalDetailsRequest,
  UpdatePersonalDetailsResponse,
} from "@/types/explorer/account";
import { useMutation } from "@tanstack/react-query";

export const useUpdatePersonalDetails = () => {
  return useMutation({
    mutationFn: async (data: UpdatePersonalDetailsRequest) => {
      const response = await fetch("/api/explorer/account/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error((result as ApiError).message || "Something went wrong");
      }
      return result as UpdatePersonalDetailsResponse;
    },
  });
};