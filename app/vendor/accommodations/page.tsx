import React from "react";
import Link from "next/link";
import AccommodationListingTable from "@/components/vendor/accommodations/AccommodationListingTable";

const Page = () => {
  return (
    <section className="h-full flex flex-col bg-muted/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary text-xl font-semibold">Accommodations</h1>
          <p className="text-gray-700 text-xs mt-1.5">
            Create and manage accommodations here
          </p>
        </div>
        <Link
          href={"/vendor/accommodations/new"}
          className="bg-primary text-white text-xs font-medium px-4 py-2.5 rounded-md"
        >
          Add Accommodation
        </Link>
      </div>

      <div className="h-full mt-6">
        <AccommodationListingTable />
      </div>
    </section>
  );
};

export default Page;