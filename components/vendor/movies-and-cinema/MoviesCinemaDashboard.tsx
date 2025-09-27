import React from "react";
import RecentNotifications from "../dashboard/RecentNotifications";
import ShowingToday from "../dashboard/ShowingToday";
import RecentBookings from "./RecentBookings";
import { useGetVendorPerformance } from "@/services/vendor/performance";
import { Loader2 } from "lucide-react";

const MoviesCinemaDashboard = () => {
  const {
    data: performanceData,
    isLoading,
    error,
  } = useGetVendorPerformance({
    type: "movies_and_cinema",
  });

  const renderMetricCard = (
    title: string,
    value: string | number,
    subtitle: string,
    isLoading: boolean,
    hasError: boolean = false
  ) => (
    <div className="bg-white rounded-lg shadow-xs p-4">
      <p className="text-primary text-xs font-medium">{title}</p>
      {isLoading ? (
        <div className="flex items-center mt-6">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-gray-500 ml-2">Loading...</span>
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
          <p className="text-sm font-semibold mt-6">{value}</p>
          <p className="text-gray-500 text-[11px] mt-2.5">{subtitle}</p>
        </>
      )}
    </div>
  );

  return (
    <section className="h-full flex flex-col bg-muted/60 p-6 overflow-y-auto">
      <div>
        <h1 className="text-primary text-xl font-semibold">Welcome 👋</h1>
        <p className="text-gray-700 text-[12px] mt-1.5">
          Here&apos;s an overview of your account performance
        </p>
      </div>

      <div className="h-full mt-6">
        <div className="h-full">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3 space-y-4 lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {renderMetricCard(
                  "Movies",
                  performanceData?.data?.totalListings || 0,
                  "Total movies",
                  isLoading,
                  !!error
                )}

                {renderMetricCard(
                  "Bookings",
                  performanceData?.data?.totalBookings || 0,
                  "Total successful bookings",
                  isLoading,
                  !!error
                )}

                {renderMetricCard(
                  "Payments",
                  performanceData?.data?.totalSuccessfulPayments || 0,
                  "Total successful payments",
                  isLoading,
                  !!error
                )}
              </div>

              <ShowingToday />
              <RecentBookings />

              {/* <RevenueSummaryChart /> */}

              {/* <RecentBookings /> */}
            </div>
            <div className="col-span-3 space-y-4 lg:col-span-1">
              <RecentNotifications />
              {/* <RecentTransactions /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoviesCinemaDashboard;