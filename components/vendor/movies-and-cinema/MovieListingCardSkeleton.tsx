import React from 'react'

const MovieListingCardSkeleton = () => {
  return (
    <div className="bg-white border border-muted rounded-xl duration-200 overflow-hidden group animate-pulse">
      {/* Image Carousel Section Skeleton */}
      <div className="relative h-48 bg-gray-200 rounded-t-xl overflow-hidden">
        {/* Main image placeholder */}
        <div className="w-full h-full bg-gray-200" />
        
        {/* Carousel indicators skeleton */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="p-4">
        <div className="space-y-2">
          {/* Title and Menu Skeleton */}
          <div className="flex items-center justify-between">
            {/* Title skeleton */}
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            
            {/* Menu button skeleton */}
            <div className="w-6 h-6 bg-gray-200 rounded" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-1.5">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieListingCardSkeleton