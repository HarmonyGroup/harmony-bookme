import { Movie } from "../vendor/movies-and-cinema";

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

export interface UseGetMoviesParams {
  page: number;
  limit: number;
  search?: string;
  genres?: string[];
  duration?: string;
}

export interface MoviesResponse {
  success: boolean;
  data: Movie[];
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

export interface MovieResponse {
  success: boolean;
  data: Movie;
  message: string;
}