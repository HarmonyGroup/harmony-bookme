import React from "react";
import Link from "next/link";
// import AccommodationListingTable from "@/components/vendor/accommodations/AccommodationListingTable";
import AccommodationListingGrid from "@/components/vendor/accommodations/AccommodationListingGrid";

const Page = () => {
  return (
    <section className="min-h-full bg-muted/60 p-4 md:p-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-primary text-lg md:text-xl font-semibold">Accommodations</h1>
          <p className="text-gray-600 text-[11px] md:text-xs mt-0.5 md:mt-1">
            Create and manage accommodations here
          </p>
        </div>
        <Link
          href={"/vendor/accommodations/new"}
          className="bg-primary text-white text-[11px] md:text-xs font-medium px-4 py-2.5 rounded-md hover:bg-primary/90 transition-all ease-in-out duration-300"
        >
          Create Accommodation
        </Link>
      </div>

      <div className="mt-6">
        {/* <AccommodationListingTable /> */}
        <AccommodationListingGrid />
      </div>
    </section>
  );
};

export default Page;