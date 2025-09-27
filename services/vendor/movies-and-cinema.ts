import {
  CreateCinemaRequest,
  CreateCinemaResponse,
  CreateMovieRequest,
  CreateMovieResponse,
  GetMoviesTodayResponse,
  useGetMoviesTodayParams,
  useGetVendorCinemasParams,
  useGetVendorMoviesParams,
  VendorCinemaResponse,
  VendorCinemasResponse,
  VendorMovieResponse,
  VendorMoviesResponse,
} from "@/types/vendor/movies-and-cinema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/vendor/movies-and-cinema";

export function useCreateCinema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateCinemaRequest
    ): Promise<CreateCinemaResponse> => {
      const response = await fetch("/api/vendor/movies-and-cinema/cinemas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create cinema");
      }

      return result;
    },
  });
}

export function useGetVendorCinemas(params: useGetVendorCinemasParams) {
  const { page, limit, search } = params;
  return useQuery<VendorCinemasResponse, ApiError>({
    queryKey: ["vendorCinemas", page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(
        `/api/vendor/movies-and-cinema/cinemas?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to fetch vendor cinemas");
      }

      return response.json();
    },
  });
}

export function useGetVendorCinema({ slug }: { slug: string }) {
  return useQuery<VendorCinemaResponse, ApiError>({
    queryKey: ["vendorCinema", slug],
    queryFn: async () => {
      const response = await fetch(
        `/api/vendor/movies-and-cinema/cinema/${slug}`,
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
        throw new Error(errorData.message || "Failed to fetch cinema");
      }

      return response.json();
    },
    enabled: !!slug,
    retry: (failureCount, error) => {
      if (
        error.message.includes("UNAUTHORIZED") ||
        error.message.includes("NOT_FOUND")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useGetVendorCinemaById({ id }: { id: string }) {
  return useQuery<VendorCinemaResponse, ApiError>({
    queryKey: ["vendorEvent", id],
    queryFn: async () => {
      const response = await fetch(
        `/api/vendor/movies-and-cinema/cinemas/${id}`,
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
        throw new Error(errorData.message || "Failed to fetch cinema");
      }

      return response.json();
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      if (
        error.message.includes("UNAUTHORIZED") ||
        error.message.includes("NOT_FOUND")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useCreateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateMovieRequest
    ): Promise<CreateMovieResponse> => {
      const response = await fetch("/api/vendor/movies-and-cinema/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create movie");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["vendorMovies"], type: "all" });
      queryClient.refetchQueries({ queryKey: ["todayMovies"], type: "all" });
    },
  });
}

export function useUpdateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/vendor/movies-and-cinema/movies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update movie");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["vendorMovies"], type: "all" });
      queryClient.refetchQueries({ queryKey: ["todayMovies"], type: "all" });
    },
  });
}

export function useGetVendorMovies(params: useGetVendorMoviesParams) {
  const { page, limit, search } = params;
  return useQuery<VendorMoviesResponse, ApiError>({
    queryKey: ["vendorMovies", page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(
        `/api/vendor/movies-and-cinema/movies?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || "Failed to fetch vendor movies");
      }

      return response.json();
    },
  });
}

export function useGetVendorMovie({ slug }: { slug: string }) {
  return useQuery<VendorMovieResponse, ApiError>({
    queryKey: ["vendorMovie", slug],
    queryFn: async () => {
      const response = await fetch(
        `/api/vendor/movies-and-cinema/movie/${slug}`,
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
      if (
        error.message.includes("UNAUTHORIZED") ||
        error.message.includes("NOT_FOUND")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useGetMoviesShowingToday(params: useGetMoviesTodayParams) {
  const { page, limit, search, cinema } = params;
  return useQuery<GetMoviesTodayResponse, ApiError>({
    queryKey: ["todayMovies", page, limit, search, cinema],

    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(cinema && { cinema }),
      });

      const response = await fetch(
        `/api/vendor/movies-and-cinema/movies/showing-today?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch movies showing today"
        );
      }

      return response.json();
    },
  });
}