import { Skeleton } from "@/components/ui/skeleton";

const PaymentsSkeleton = () => {
  return (
    <div className="space-y-5">
      {/* Account Name Field */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Bank Name Field */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Account Number Field */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

export default PaymentsSkeleton;
