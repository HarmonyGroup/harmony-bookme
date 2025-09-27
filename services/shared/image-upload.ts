import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/types/accommodation";

interface UploadImageResponse {
  success: true;
  data: {
    url: string;
  };
  message: string;
}

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadImageResponse, ApiError, FormData>({
    mutationFn: async (formData) => {
      const response = await fetch("/api/shared/image-upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw result as ApiError;
      }

      return result as UploadImageResponse;
    },
  });
};