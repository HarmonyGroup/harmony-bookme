import React from "react";
// import EventListingTable from "@/components/vendor/events/EventListingTable";
import Link from "next/link";
import EventListingGrid from "@/components/vendor/events/EventListingGrid";

const Page = () => {
  return (
    <section className="h-full flex flex-col bg-muted/60 p-4 md:p-5 pt-8 md:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary text-lg md:text-xl font-semibold">
            Events
          </h1>
          <p className="text-gray-600 text-[11px] md:text-xs mt-0.5 md:mt-1">
            Create and manage your events here
          </p>
        </div>

        <Link
          href={"/vendor/events/new"}
          className="bg-primary text-white text-[11px] md:text-xs font-medium px-4 py-2.5 rounded-md hover:bg-primary/90 transition-all ease-in-out duration-300"
        >
          Create Event
        </Link>
      </div>

      <div className="h-full mt-6">
        <EventListingGrid />
      </div>
    </section>
  );
};

export default Page;
