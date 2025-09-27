import {
  MoviesResponse,
  UseGetMoviesParams,
  ApiError,
  MovieResponse,
} from "@/types/public/movies-and-cinema";
import { useQuery } from "@tanstack/react-query";

export const useGetAllMovies = (params: UseGetMoviesParams) => {
  const { page, limit, search, genres, duration } = params;

  return useQuery<MoviesResponse, ApiError>({
    queryKey: ["movies", page, limit, search, genres, duration],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) queryParams.append("search", search);
      if (genres && genres.length > 0)
        queryParams.append("genres", genres.join(","));
      if (duration) queryParams.append("duration", duration);

      const response = await fetch(
        `/api/public/movies-and-cinema/movies?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to fetch movies");
      }

      return response.json();
    },
  });
};

export const useGetMovie = ({ slug }: { slug: string }) => {
  return useQuery<MovieResponse, ApiError>({
    queryKey: ["movie", slug],
    queryFn: async () => {
      const response = await fetch(
        `/api/public/movies-and-cinema/movies/${slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // credentials: 'include', // Include cookies for authentication
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to fetch movie");
      }
      return response.json();
    },
    enabled: !!slug,
    retry: (failureCount, error) => {
      if (error.message.includes("NOT_FOUND")) {
        return false;
      }
      return failureCount < 3;
    },
  });
};