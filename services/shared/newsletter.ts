import {
  NewsletterSubscriptionRequest,
  NewsletterSubscriptionResponse,
} from "@/types/newsletter";
import { useMutation } from "@tanstack/react-query";

export const useNewsletterSubscription = () => {
  return useMutation({
    mutationFn: async (data: NewsletterSubscriptionRequest) => {
      const response = await fetch(`/api/shared/newsletter`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        // credentials: "include",
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error((result as ApiError).message || "Something went wrong");
      }
      return result as NewsletterSubscriptionResponse;
    },
  });
};