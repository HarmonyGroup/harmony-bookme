"use client";

import React from "react";
import Link from "next/link";
import LeisureListingTable from "@/components/vendor/leisure/LeisureListingTable";

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
    <section className="h-full flex flex-col bg-muted/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary text-xl font-semibold">Leisure</h1>
          <p className="text-gray-700 text-xs mt-1.5">
            Create and manage leisure activities here
          </p>
        </div>
        <Link
          href={"/vendor/leisure/new"}
          className="bg-primary text-white text-xs font-medium px-4 py-2.5 rounded-md"
        >
          Add Leisure
        </Link>
      </div>

      <div className="h-full mt-6">
        <LeisureListingTable />
      </div>
    </section>
  );
}