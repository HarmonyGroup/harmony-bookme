"use client";

import React from "react";
import Link from "next/link";
import LeisureListingGrid from "@/components/vendor/leisure/LeisureListingGrid";

export default function LeisureListingsPage() {
  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "active":
  //       return "bg-green-100 text-green-800";
  //     case "draft":
  //       return "bg-gray-100 text-gray-800";
  //     case "inactive":
  //       return "bg-red-100 text-red-800";
  //     case "rejected":
  //       return "bg-red-100 text-red-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  return (
    <section className="min-h-full bg-muted/60 p-4 md:p-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-primary text-lg md:text-xl font-semibold">Leisure</h1>
          <p className="text-gray-600 text-[11px] md:text-xs mt-0.5 md:mt-1">
            Create and manage leisure activities here
          </p>
        </div>
        <Link
          href={"/vendor/leisure/new"}
          className="bg-primary text-white text-xs font-medium px-4 py-2.5 rounded-md"
        >
          Create Leisure
        </Link>
      </div>

      <div className="mt-6">
        <LeisureListingGrid />
      </div>
    </section>
  );
}