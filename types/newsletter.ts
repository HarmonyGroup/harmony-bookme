export interface NewsletterSubscriptionRequest {
  isNewsletterSubscribed: boolean;
}

export interface NewsletterSubscriptionResponse {
  success: true;
  message: string;
}