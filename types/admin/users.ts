export interface ApiError {
  success: false;
  error: string;
  message: string;
}

export interface useGetUsersParams {
  page: number;
  limit: number;
  role: string | string[];
  search?: string;
}

export interface useGetUsersResponse {
  success: boolean;
  data: any[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface useUpdateAccountStatusRequest {
  id: string;
  status: string;
}

export interface useUpdateAccountStatusResponse {
  success: true;
  message: string;
}

export interface useAddUserRequest {
  role: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  password: string;
}

export interface useAddUserResponse {
  success: true;
  message: string;
}