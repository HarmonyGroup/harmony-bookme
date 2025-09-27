import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  useUpdateConfigurationRequest, 
  useUpdateConfigurationResponse
} from "@/types/admin/configuration";

const API_BASE_URL = "/api/admin/configuration";

export const useUpdateConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: useUpdateConfigurationRequest): Promise<useUpdateConfigurationResponse> => {
      const response = await fetch(API_BASE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update configuration");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch configuration data
      queryClient.invalidateQueries({ queryKey: ["configuration"] });
    },
  });
};
