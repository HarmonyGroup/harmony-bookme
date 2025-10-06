"use client";

import { useGetVendorMovies } from "@/services/vendor/movies-and-cinema";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import MovieListingCard from "./MovieListingCard";
import MovieListingCardSkeleton from "./MovieListingCardSkeleton";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import Image from "next/image";

const MovieListingGrid = () => {
  const [page] = useState(1);
  const [limit] = useState(10);
  const [search] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useGetVendorMovies({
    page,
    limit,
    search: debouncedSearch,
  });

  const movies = data?.data || [];

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Array.from({ length: 6 }).map((_, index) => (
            <MovieListingCardSkeleton key={index} />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 px-4">
          <Image
            src={EmptyIcon}
            className="size-14"
            alt="Harmony Bookme"
            loading="lazy"
          />
          <h3 className="text-gray-700 text-sm font-semibold">
            No Movies Found
          </h3>
          <p className="text-gray-500 text-xs text-center max-w-md">
            {search
              ? "No movies match your current filters. Try adjusting your search criteria."
              : "You haven't created any movies yet. Get started by creating your first movie."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {movies.map((movie) => (
            <MovieListingCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieListingGrid;