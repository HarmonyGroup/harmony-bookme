import { AccommodationListing } from "../accommodation";

export interface UseGetVendorAccommodationsParams {
  page: number;
  limit: number;
  search?: string;
}

export interface VendorAccommodationsResponse {
  success: boolean;
  data: AccommodationListing[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

export interface DeleteAccommodationResponse {
  success: boolean;
  message: string;
}