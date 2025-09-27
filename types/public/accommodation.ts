import { AccommodationListing } from "../accommodation";

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

export interface UseGetAccommodationsParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  bedrooms?: string;
  bathrooms?: string;
  buildingType?: string;
  minPrice?: string;
  maxPrice?: string;
}

export interface AccommodationsResponse {
  success: boolean;
  data: AccommodationListing[];
  pagination: Pagination;
  message: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AccommodationResponse {
  success: boolean;
  data: AccommodationListing;
  message: string;
}