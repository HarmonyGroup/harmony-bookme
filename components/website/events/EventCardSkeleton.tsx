import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const EventCardSkeleton = () => {
  return (
    <div className='rounded-xl p-4 bg-white border border-muted transition-all duration-300'>
      <div className='flex flex-col'>
        {/* Image Carousel Section Skeleton */}
        <div className="relative h-48 bg-gray-50 rounded-t-xl overflow-hidden">
          <Skeleton className="w-full h-full" />
          
          {/* Dot indicators skeleton */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <Skeleton className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <Skeleton className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <Skeleton className="w-1.5 h-1.5 rounded-full bg-white/60" />
          </div>
        </div>

        {/* Content Section Skeleton */}
        <div className="flex flex-col">
          {/* Title */}
          <Skeleton className="h-5 w-3/4 mt-4" />
          
          {/* Date */}
          <Skeleton className="h-3 w-full mt-2.5" />
          
          {/* Address */}
          <Skeleton className="h-3 w-2/3 mt-2.5" />
          
          {/* Price and Button */}
          <div className='flex items-center justify-between mt-4 border-muted border-t pt-4'>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md bg-gray-200/60" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCardSkeleton;