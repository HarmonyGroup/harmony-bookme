import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/types/accommodation";

interface UpdateAvatarResponse {
  success: true;
  message: string;
  data: {
    avatar: string;
  };
}

interface UpdateAvatarData {
  avatar: string;
}

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateAvatarResponse, ApiError, UpdateAvatarData>({
    mutationFn: async (data: UpdateAvatarData) => {
      const response = await fetch("/api/shared/avatar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw result as ApiError;
      }

      return result as UpdateAvatarResponse;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["vendorInformation"] });
    },
  });
};

export const useRemoveAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateAvatarResponse, ApiError, void>({
    mutationFn: async () => {
      const response = await fetch("/api/shared/avatar", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw result as ApiError;
      }

      return result as UpdateAvatarResponse;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["vendorInformation"] });
    },
  });
};