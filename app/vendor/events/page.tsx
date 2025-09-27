import React from "react";
import EventListingTable from "@/components/vendor/events/EventListingTable";
import Link from "next/link";

const Page = () => {
  return (
    <section className="h-full flex flex-col bg-muted/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary text-xl font-semibold">Events</h1>
          <p className="text-gray-700 text-xs mt-1.5">
            Create and manage events here
          </p>
        </div>
        <Link
          href={"/vendor/events/new"}
          className="bg-primary text-white text-xs font-medium px-4 py-2.5 rounded-md"
        >
          Create Event
        </Link>
      </div>

      <div className="h-full mt-6">
        <EventListingTable />
      </div>
    </section>
  );
};

export default Page;