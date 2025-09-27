import { Skeleton } from "@/components/ui/skeleton";

const ConfigurationSkeleton = () => {
  return (
    <div className="space-y-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
      
      <div className="flex justify-end pt-4">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

export default ConfigurationSkeleton;
