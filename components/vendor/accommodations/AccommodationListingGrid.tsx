/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState } from "react";
import { useGetVendorAccommodations } from "@/services/vendor/accommodation";
import { useDebounce } from "use-debounce";
import AccommodationListingCard from "./AccommodationListingCard";

const AccommodationListingGrid = () => {
  const [page] = useState(1);
  const [limit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const { data, isLoading } = useGetVendorAccommodations({
    page,
    limit,
    search: debouncedSearchQuery,
  });

  const accommodations = data?.data || [];

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            // <AccommodationCardSkeleton key={index} />
            <></>
          ))}
        </div>
      ) : accommodations.length === 0 ? (
        // <EmptyState />
        <></>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {accommodations.map((accommodation) => (
            // <AccommodationCard key={accommodation._id} accommodation={accommodation} />
            <AccommodationListingCard key={accommodation._id} accommodation={accommodation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccommodationListingGrid;