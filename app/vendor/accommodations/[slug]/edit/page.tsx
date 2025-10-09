"use client"

import React from 'react'
import AccommodationListingForm from '@/components/vendor/accommodations/AccommodationListingForm'
import { useGetVendorAccommodation } from '@/services/vendor/accommodation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page = ({ params }: PageProps) => {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;

  const { data, isLoading } = useGetVendorAccommodation({ slug });

  const accommodation = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-xs">Loading...</p>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-xs">Accommodation not found</p>
      </div>
    );
  }

  return (
    <div>
      <AccommodationListingForm accommodation={accommodation} />
    </div>
  )
}

export default Page