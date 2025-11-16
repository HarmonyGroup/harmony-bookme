import React from "react";
import Link from "next/link";
import AdminEventListingGrid from "@/components/admin/events/AdminEventListingGrid";

const Page = () => {
  return (
    <section className="min-h-full bg-muted/60 p-4 md:p-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-primary text-lg md:text-xl font-semibold">
            Events
          </h1>
          <p className="text-gray-600 text-[11px] md:text-xs mt-0.5 md:mt-1">
            View and manage all events on the platform
          </p>
        </div>

        <Link
          href={"/admin/events/new"}
          className="bg-primary text-white text-[11px] md:text-xs font-medium px-4 py-2.5 rounded-md hover:bg-primary/90 transition-all ease-in-out duration-300"
        >
          Create Event
        </Link>
      </div>

      <div className="mt-6">
        <AdminEventListingGrid />
      </div>
    </section>
  );
};

export default Page;



