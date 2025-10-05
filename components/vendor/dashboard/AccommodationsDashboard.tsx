import React from "react";
// import RevenueSummaryChart from "./RevenueSummaryChart";
// import RecentBookings from "./RecentBookings";
import RecentNotifications from "./RecentNotifications";
import { useGetVendorPerformance } from "@/services/vendor/performance";
import DashboardMetricCard from "../shared/DashboardMetricCard";
import RecentBookingsTable from "../shared/RecentBookingsTable";

const AccommodationsDashboard = () => {
  const {
    data: performanceData,
    isLoading,
    error,
  } = useGetVendorPerformance({
    type: "accommodations",
  });

  console.log(performanceData);

  return (
    <section className="h-full flex flex-col bg-muted/60 p-4 md:p-6 overflow-y-auto">
      <div className="mt-4 md:mt-0">
        <h1 className="text-primary text-lg md:text-xl font-semibold">
          Dashboard
        </h1>
        <p className="text-gray-700 text-[11px] md:text-xs mt-1">
          Here&apos;s an overview of your account activities
        </p>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3 space-y-4 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardMetricCard
                title="Total Events"
                value={performanceData?.data?.totalListings || 0}
                subtitle="Since Last Week"
                isLoading={isLoading}
                hasError={!!error}
              />
              <DashboardMetricCard
                title="Total Bookings"
                value={performanceData?.data?.totalBookings || 0}
                subtitle="Since Last Week"
                isLoading={isLoading}
                hasError={!!error}
              />
              <DashboardMetricCard
                title="Total Revenue"
                value={performanceData?.data?.totalSuccessfulPayments || 0}
                subtitle="Since Last Week"
                isLoading={isLoading}
                hasError={!!error}
              />
            </div>

            <RecentBookingsTable type="accommodations" />
          </div>
          <div className="col-span-3 space-y-4 lg:col-span-1">
            <RecentNotifications />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccommodationsDashboard;