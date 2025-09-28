import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const LeisureCardSkeleton = () => {
  return (
    <div className="rounded-3xl p-4 bg-white border border-muted transition-all duration-300">
      <div className="flex flex-col">
        {/* Image Carousel Section */}
        <div className="relative h-48 bg-gray-50 rounded-t-2xl overflow-hidden">
          <Skeleton className="w-full h-full" />
          {/* Carousel navigation buttons */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full">
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full">
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-4 space-y-2.5">
          {/* Title */}
          <Skeleton className="h-4 w-3/4 bg-muted" />
          {/* Venue */}
          <Skeleton className="h-3 w-1/2 bg-muted" />
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between mt-4 border-muted border-t pt-4">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-8 bg-muted" />
            <Skeleton className="h-4 w-16 bg-muted" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default LeisureCardSkeleton;