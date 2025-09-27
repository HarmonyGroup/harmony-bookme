import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetVendorInformation = () => {
  return useQuery<GetVendorResponse, ApiError>({
    queryKey: ["vendorInformation"],
    queryFn: async () => {
      const response = await fetch("/api/vendor/account", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw result as ApiError;
      }

      return result as GetVendorResponse;
    },
  });
};

export const useUpdateVendorInformation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateVendorResponse, ApiError, UpdateVendorData>({
    mutationFn: async (data: UpdateVendorData) => {
      const response = await fetch("/api/vendor/account", {
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

      return result as UpdateVendorResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};