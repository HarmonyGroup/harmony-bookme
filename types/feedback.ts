export interface Feedback {
  _id: string;
  mood: string;
  feedback: string;
}

export interface SubmitFeedbackRequest {
  mood: string;
  feedback: string;
}

export interface SubmitFeedbackResponse {
  success: boolean;
  data: Feedback;
  message: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}