import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const EventCardSkeleton = () => {
  return (
    <div className="grid grid-cols-3 border border-gray-200/45 rounded-lg overflow-hidden bg-white">
      <div className="relative col-span-1 h-52 bg-muted overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-2 left-2 bg-white flex items-center gap-1 rounded-sm px-2 py-1">
          <Skeleton className="w-6 h-4 bg-muted" />
          <Skeleton className="w-3 h-3 rounded-full bg-muted" />
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
      <div className="col-span-2 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-3/4 bg-muted" />
            <Skeleton className="w-9 h-9 rounded-full bg-gray-200/60" />
          </div>
          <div className="flex items-center gap-2.5 mt-2.5">
            <Skeleton className="h-4 w-16 bg-muted" />
            <Skeleton className="h-4 w-2 bg-muted" />
            <Skeleton className="h-4 w-16 bg-muted" />
            <Skeleton className="h-4 w-2 bg-muted" />
            <Skeleton className="h-4 w-16 bg-muted" />
          </div>
          <div className="mt-2.5 space-y-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md bg-gray-200/60" />
        </div>
      </div>
    </div>
  )
}

export default EventCardSkeleton;