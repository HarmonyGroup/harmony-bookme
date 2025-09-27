export interface UpdatePersonalDetailsRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone?: string;
}

export interface UpdatePersonalDetailsResponse {
  success: true;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    phone?: string;
  };
  message: string;
}