import React, { useState } from "react";
import { useLeisureListings } from "@/services/vendor/leisure";
import { useDebounce } from "use-debounce";
import LeisureListingCard from "./LeisureListingCard";
import MovieListingCardSkeleton from "../movies-and-cinema/MovieListingCardSkeleton";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import Image from "next/image";

const LeisureListingGrid = () => {
  const [page] = useState(1);
  const [limit] = useState(10);
  const [search] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useLeisureListings({
    page,
    limit,
    search: debouncedSearch,
  });

  const leisureListings = data?.data || [];

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <MovieListingCardSkeleton key={index} />
          ))}
        </div>
      ) : leisureListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 px-4">
          <Image
            src={EmptyIcon}
            className="size-14"
            alt="Harmony Bookme"
            loading="lazy"
          />
          <h3 className="text-gray-700 text-sm font-semibold">
            No Leisure Found
          </h3>
          <p className="text-gray-500 text-xs text-center max-w-md">
            {search
              ? "No leisure match your current filters. Try adjusting your search criteria."
              : "You haven't created any leisure yet. Get started by creating your first leisure."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {leisureListings.map((leisure) => (
            <LeisureListingCard key={leisure._id} leisure={leisure} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeisureListingGrid;