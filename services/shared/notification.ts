import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, NotificationsResponse } from "@/types/notification";

// Hook to fetch notifications
export function useGetNotifications({
  status = "",
  limit = 10,
  skip = 0,
  search = "",
}: {
  status?: "unread" | "read" | "";
  limit?: number;
  skip?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["notifications", status, limit, skip, search],
    queryFn: async (): Promise<NotificationsResponse> => {
      const params = new URLSearchParams({
        limit: String(limit),
        skip: String(skip),
      });
      if (status) {
        params.append("status", status);
      }
      if (search) {
        params.append("search", search);
      }

      const response = await fetch(
        `/api/shared/notifications?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // For next-auth
        }
      );

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(
          (result as ApiError).message || "Failed to fetch notifications"
        );
      }

      return result as NotificationsResponse;
    },
  });
}

// Hook to mark a notification as read
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<{ id: string; status: string }> => {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(
          (result as ApiError).message || "Failed to mark notification as read"
        );
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error.message);
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/shared/notifications/mark-all-read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(
          (result as ApiError).message ||
            "Failed to mark all notifications as read"
        );
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Error marking all notifications as read:", error.message);
    },
  });
}