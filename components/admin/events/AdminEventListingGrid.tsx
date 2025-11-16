"use client";

import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useGetAdminEvents } from "@/services/admin/events";
import EventListingCard from "@/components/vendor/events/EventListingCard";
import EventListingCardSkeleton from "@/components/vendor/events/EventListingCardSkeleton";
import Image from "next/image";
import EmptyIcon from "@/public/assets/empty-data-icon.png";

const AdminEventListingGrid = () => {
  const [page] = useState(1);
  const [limit] = useState(20);
  const [searchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [categoryFilter] = useState("all");
  const [pricingTypeFilter] = useState("all");

  const { data, isLoading } = useGetAdminEvents({
    page,
    limit,
    search: debouncedSearchQuery,
    category: categoryFilter !== "all" ? categoryFilter : "",
    pricingType: pricingTypeFilter !== "all" ? pricingTypeFilter : "",
  });

  const events = data?.data || [];

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center gap-2 py-20 px-4">
      <Image
        src={EmptyIcon}
        className="size-14"
        alt="Harmony Bookme"
        loading="lazy"
      />
      <h3 className="text-gray-700 text-sm font-semibold">No Events Found</h3>
      <p className="text-gray-500 text-xs text-center max-w-md">
        No events match your current filters. Try adjusting your search criteria.
      </p>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <EventListingCardSkeleton key={index} />
      ))}
    </div>
  );

  return (
    <div>
      {isLoading ? (
        <LoadingSkeleton />
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {events.map((event) => (
            <EventListingCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEventListingGrid;



