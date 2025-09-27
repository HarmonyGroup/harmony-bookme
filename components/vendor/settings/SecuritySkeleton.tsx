import { Skeleton } from "@/components/ui/skeleton";

const SecuritySkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Password Section */}
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-2 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Transaction Pin Section */}
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-52" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* 2FA Section */}
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-2 w-64" />
        </div>
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  );
};

export default SecuritySkeleton;
