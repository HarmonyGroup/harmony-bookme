"use client";

import React from "react";
import EventBookingTable from "@/components/vendor/events/EventBookingTable";
import LeisureBookingsTable from "@/components/vendor/leisure/LeisureBookingsTable";
import { useSession } from "next-auth/react";
import AccommodationBookingsTable from "@/components/vendor/accommodations/AccommodationBookingsTable";
import MovieBookingsTable from "@/components/vendor/movies-and-cinema/MovieBookingsTable";

const Page = () => {
  const { data: session } = useSession();

  return (
    <section className="h-full flex flex-col bg-muted/60 p-4 md:p-6 overflow-y-auto">
      <div className="mt-4 md:mt-0">
        <h1 className="text-primary text-lg md:text-xl font-semibold">
          Bookings
        </h1>
        <p className="text-gray-700 text-[11px] md:text-xs mt-1">
          Manage all explorer bookings here
        </p>
      </div>

      <div className="h-full mt-6">
        {session?.user?.vendorAccountPreference === "events" && (
          <EventBookingTable />
        )}
        {session?.user?.vendorAccountPreference === "leisure" && (
          <LeisureBookingsTable />
        )}
        {session?.user?.vendorAccountPreference === "accommodations" && (
          <AccommodationBookingsTable />
        )}

        {session?.user?.vendorAccountPreference === "movies_and_cinema" && (
          <MovieBookingsTable />
        )}
      </div>
    </section>
  );
};

export default Page;