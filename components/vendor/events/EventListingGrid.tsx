"use client";

import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useGetVendorEvents } from "@/services/vendor/event";
import EventListingCard from "./EventListingCard";
import EventListingCardSkeleton from "./EventListingCardSkeleton";
import Image from "next/image";
import EmptyIcon from "@/public/assets/empty-data-icon.png";

const EventListingGrid = () => {
  const [page] = useState(1);
  const [limit] = useState(20);
  const [searchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [statusFilter] = useState("all");
  const [categoryFilter] = useState("all");
  const [pricingTypeFilter] = useState("all");

  // Fetch events data
  const { data, isLoading } = useGetVendorEvents({
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
        {searchQuery ||
        statusFilter !== "all" ||
        categoryFilter !== "all" ||
        pricingTypeFilter !== "all"
          ? "No events match your current filters. Try adjusting your search criteria."
          : "You haven't created any events yet. Get started by creating your first event."}
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
      {/* Events Grid */}
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

export default EventListingGrid;