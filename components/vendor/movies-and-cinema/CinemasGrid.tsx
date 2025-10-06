"use client";

import { useGetVendorCinemas } from "@/services/vendor/movies-and-cinema";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import CinemaCard from "./CinemaCard";
import MovieListingCardSkeleton from "./MovieListingCardSkeleton";
import Image from "next/image";
import EmptyIcon from "@/public/assets/empty-data-icon.png";

const CinemasGrid = () => {
  const [page] = useState(1);
  const [limit] = useState(10);
  const [search] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useGetVendorCinemas({
    page,
    limit,
    search: debouncedSearch,
  });

  const cinemas = data?.data || [];

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Array.from({ length: 6 }).map((_, index) => (
            <MovieListingCardSkeleton key={index} />
          ))}
        </div>
      ) : cinemas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 px-4">
          <Image
            src={EmptyIcon}
            className="size-14"
            alt="Harmony Bookme"
            loading="lazy"
          />
          <h3 className="text-gray-700 text-sm font-semibold">
            No Cinemas Found
          </h3>
          <p className="text-gray-500 text-xs text-center max-w-md">
            {search
              ? "No cinemas match your current filters. Try adjusting your search criteria."
              : "You haven't created any cinemas yet. Get started by creating your first cinema."}
          </p>
          {/* <Link href="/vendor/events/new">
            <Button className="flex items-center gap-2">Create Cinema</Button>
          </Link> */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {cinemas.map((cinema) => (
            <CinemaCard key={cinema._id} cinema={cinema} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CinemasGrid;