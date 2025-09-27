"use client"

import React from 'react'
import EventsListingForm from '@/components/vendor/events/EventListingForm'
import { useGetVendorEvent } from '@/services/vendor/event';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page = ({ params }: PageProps) => {
  const resolvedParams = React.use(params);
    const { slug } = resolvedParams;
  
    const { data, isLoading } = useGetVendorEvent({ slug });
    const event = data?.data;

      if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Event not found</p>
      </div>
    );
  }
  return (
    <>
      <EventsListingForm event={event}  />
    </>
  )
}

export default Page