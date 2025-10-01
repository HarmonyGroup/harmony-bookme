import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  isLoading: boolean;
  hasError: boolean;
}

const DashboardMetricCard = ({
  title,
  value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subtitle,
  isLoading,
  hasError,
}: DashboardMetricCardProps) => {
  return (
    <div className="bg-white border border-muted rounded-lg shadow-none p-4">
      <p className="text-primary text-xs font-medium">{title}</p>
      {isLoading ? (
        <div className="space-y-2.5 mt-6">
          <Skeleton className="w-14 h-4" />
          <Skeleton className="w-28 h-4" />
        </div>
      ) : hasError ? (
        <>
          <p className="text-sm font-semibold mt-6 text-red-500">Error</p>
          <p className="text-gray-500 text-[11px] mt-2.5">
            Failed to load data
          </p>
        </>
      ) : (
        <>
          <p className="text-primary text-base font-semibold mt-6">{value}</p>
          {/* <p className="text-gray-500 text-[11px] mt-2.5">{subtitle}</p> */}
        </>
      )}
    </div>
  );
};

export default DashboardMetricCard;