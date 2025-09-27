import React from "react";
import RevenueSummaryChart from "./RevenueSummaryChart";
import RecentBookings from "./RecentBookings";
import RecentNotifications from "./RecentNotifications";

const AccommodationsDashboard = () => {
  return (
    <section className="h-full flex flex-col bg-gray-50/80 p-6 overflow-y-auto">
      <div className="">
        <div>
          <h1 className="text-primary text-xl font-semibold">Dashboard</h1>
          <p className="text-gray-700 text-xs mt-1.5">
            Here&apos;s an overview of your account performance
          </p>
        </div>
      </div>

      <div className="h-full mt-6">
        <div className="h-full">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 space-y-4 lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-100/80 rounded-lg shadow-xs p-4">
                  <p className="text-primary text-xs font-semibold">
                    Total Events
                  </p>
                  <p className="text-sm font-semibold mt-6">2</p>
                  <p className="text-gray-500 text-[11px] mt-2.5">
                    Since Last Week
                  </p>
                </div>

                <div className="bg-white border border-gray-100/80 rounded-lg shadow-xs p-4">
                  <p className="text-primary text-xs font-semibold">
                    Total Bookings
                  </p>
                  <p className="text-sm font-semibold mt-6">18</p>
                  <p className="text-gray-500 text-[11px] mt-2.5">
                    Since Last Week
                  </p>
                </div>

                <div className="bg-white border border-gray-100/80 rounded-lg shadow-xs p-4">
                  <p className="text-primary text-xs font-semibold">
                    Total Revenue
                  </p>
                  <p className="text-sm font-semibold mt-6">NGN 45,000,000</p>
                  <p className="text-gray-500 text-[11px] mt-2.5">
                    Since Last Week
                  </p>
                </div>
              </div>

              <RevenueSummaryChart />

              <RecentBookings />
            </div>
            <div className="col-span-3 space-y-4 lg:col-span-1">
              <RecentNotifications />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccommodationsDashboard;