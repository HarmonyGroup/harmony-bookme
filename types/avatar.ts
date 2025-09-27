export interface UpdateAvatarRequest {
  avatar: string | null;
}

export interface UpdateAvatarResponse {
  success: true;
  message: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}