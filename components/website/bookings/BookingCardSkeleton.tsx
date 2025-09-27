import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const BookingCardSkeleton = () => {
  return (
    <div className="w-full bg-muted/25 border border-gray-200/60 rounded-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Skeleton className="flex-shrink-0 w-14 h-14 rounded-lg" />
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <Skeleton className="h-5 w-3/4 sm:w-1/2 rounded-md" />
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <Skeleton className="h-6 w-20 rounded-sm" />
                <Skeleton className="h-6 w-32 rounded-sm" />
              </div>
            </div>
            <Skeleton className="h-7 w-20 rounded-md" />
          </div>

          <div className="mt-4 sm:mt-6">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-12 rounded-sm" />
                <Skeleton className="h-4 w-24 rounded-sm" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-20 rounded-sm" />
                <Skeleton className="h-4 w-28 rounded-sm" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-16 rounded-sm" />
                <Skeleton className="h-4 w-20 rounded-sm" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-16 rounded-sm" />
                <Skeleton className="h-4 w-24 rounded-sm" />
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-dashed border-gray-300 pt-5">
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-6 w-6 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCardSkeleton;