import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const RecentNotificationCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 transition-colors ease-in-out duration-300">
      <div className="flex items-start gap-3">
        <Skeleton className="bg-gray-200 size-10 rounded-sm" />
        <div className="flex flex-col gap-1 py-[1px]">
          <Skeleton className="h-3 w-24 bg-gray-200" />
          <Skeleton className="h-3 w-40 bg-gray-200" />
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-3 w-10 bg-gray-200" />
      </div>
    </div>
  );
};

export default RecentNotificationCardSkeleton;