import {
  useGetUsersParams,
  useGetUsersResponse,
  ApiError,
  useUpdateAccountStatusResponse,
  useUpdateAccountStatusRequest,
  useAddUserRequest,
} from "@/types/admin/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetUsers(params: useGetUsersParams) {
  const { page, limit, role, search } = params;
  return useQuery<useGetUsersResponse, ApiError>({
    queryKey: ["users", page, limit, Array.isArray(role) ? role.sort().join(',') : role, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(role && { role: Array.isArray(role) ? role.join(',') : role }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }

      return response.json();
    },
  });
}

export function useUpdateAccountStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    useUpdateAccountStatusResponse,
    ApiError,
    useUpdateAccountStatusRequest
  >({
    mutationFn: async (data) => {
      const response = await fetch(`/api/admin/users/status`, {
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

      return result as useUpdateAccountStatusResponse;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["users"], type: "all" });
    },
  });
}

export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: useAddUserRequest) => {
      const response = await fetch(`/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add user");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["users"], type: "all" });
    },
  });
};