import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const GeneralSkeleton = () => {
  return (
    <div className="space-y-5 mt-6">
      {/* Avatar Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="size-28 rounded-full" />
        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
          <Skeleton className="h-4 w-40 mt-3 rounded" />
        </div>
      </div>
      {/* Business Name Skeleton */}
      <div>
        <Skeleton className="h-4 w-24 mb-2 rounded" />
        <Skeleton className="h-10 w-full rounded-md border shadow-xs" />
      </div>
      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Skeleton className="h-4 w-16 mb-2 rounded" />
          <Skeleton className="h-10 w-full rounded-md border shadow-xs" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2 rounded" />
          <Skeleton className="h-10 w-full rounded-md border shadow-xs" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2 rounded" />
          <Skeleton className="h-10 w-full rounded-md border shadow-xs" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2 rounded" />
          <Skeleton className="h-10 w-full rounded-md border shadow-xs" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2 rounded" />
          <Skeleton className="h-10 w-full rounded-md border shadow-xs" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2 rounded" />
          <Skeleton className="h-10 w-full rounded-md border shadow-xs" />
        </div>
      </div>
      {/* Submit Button Skeleton */}
      <Skeleton className="h-8 w-24 rounded-md float-end" />
    </div>
  );
};

export default GeneralSkeleton;