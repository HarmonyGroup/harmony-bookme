import React from "react";
import EventListingTable from "@/components/vendor/events/EventListingTable";
import Link from "next/link";

const Page = () => {
  return (
    <section className="h-full flex flex-col bg-muted/60 p-4 md:p-6 pt-8 md:pt-6">
      <div className="flex items-start flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-primary text-lg md:text-xl font-semibold">Events</h1>
          <p className="text-gray-700 text-[11px] md:text-xs mt-0.5 md:mt-1">
            Create and manage your events here
          </p>
        </div>
        <Link
          href={"/vendor/events/new"}
          className="flex items-center gap-1.5 bg-primary text-white text-[11px] md:text-xs font-medium px-4 py-2.5 rounded-md hover:bg-primary/90 transition-all ease-in-out duration-300"
        >
          Create Event
        </Link>
      </div>

      <div className="h-full bg-white border border-muted rounded-lg p-4 md:p-4 mt-6">
        <EventListingTable />
      </div>
    </section>
  );
};

export default Page;
