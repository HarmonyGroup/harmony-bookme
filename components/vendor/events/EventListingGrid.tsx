/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { useGetVendorEvents } from "@/services/vendor/event";
import EventListingCard from "./EventListingCard";
import EventListingCardSkeleton from "./EventListingCardSkeleton";

const EventListingGrid = () => {
  const [page] = useState(1);
  const [limit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pricingTypeFilter, setPricingTypeFilter] = useState("all");

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
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Calendar className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No events found
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-sm">
        {searchQuery ||
        statusFilter !== "all" ||
        categoryFilter !== "all" ||
        pricingTypeFilter !== "all"
          ? "No events match your current filters. Try adjusting your search criteria."
          : "You haven't created any events yet. Get started by creating your first event."}
      </p>
      <Link href="/vendor/events/new">
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Your First Event
        </Button>
      </Link>
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