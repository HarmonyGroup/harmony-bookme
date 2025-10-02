"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const EventListingCardSkeleton = () => {
  return (
    <div className="bg-white border border-muted rounded-xl duration-200 overflow-hidden group">
      <div className="relative h-48 bg-gray-100">
        <Skeleton className="h-full w-full" />
        {/* Carousel indicators skeleton */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="w-2 h-2 rounded-full" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-1" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </div>
    </div>
  );
};

export default EventListingCardSkeleton;
