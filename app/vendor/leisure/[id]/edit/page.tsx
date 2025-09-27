"use client";

import React from "react";
import { useLeisureListing } from "@/services/vendor/leisure";
import LeisureListingForm from "@/components/vendor/leisure/LeisureListingForm";
import { useParams } from "next/navigation";

export default function EditLeisureListingPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: listing, isLoading, error } = useLeisureListing(id);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600">Error loading listing: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600">Listing not found</p>
        </div>
      </div>
    );
  }

  return <LeisureListingForm listing={listing} />;
}
