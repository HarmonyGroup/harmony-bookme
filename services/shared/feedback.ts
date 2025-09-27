import { useMutation } from "@tanstack/react-query";
import {
  ApiError,
  SubmitFeedbackRequest,
  SubmitFeedbackResponse,
} from "@/types/feedback";

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: async (data: SubmitFeedbackRequest) => {
      const response = await fetch(`/api/shared/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        // credentials: "include",
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(
          (result as ApiError).message || "Failed to submit feedback"
        );
      }
      return result as SubmitFeedbackResponse;
    },
  });
}