import { LeisureListing } from "../vendor/leisure";

export interface ApiError {
    success: false;
    error: string;
    message: string;
};

export interface UseGetLeisuresParams {
    page: number;
    limit: number;
    search?: string;
}

export interface LeisureListingsResponse {
    success: boolean;
    data: LeisureListing[];
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

export interface LeisureResponse {
    success: boolean;
    data: LeisureListing;
    message: string;
}