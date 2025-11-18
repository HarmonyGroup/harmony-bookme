"use client";

import React from "react";
import { useGetAllEvents } from "@/services/public/event";

const FeaturedEvents = () => {
  const { data } = useGetAllEvents({
    page: 1,
    limit: 10,
    search: "",
    category: "",
    pricingType: "",
    eventFormat: "",
    date: undefined,
  });

  const events = data?.data || [];
  console.log(events);

  return (
    <section className="bg-white pt-14 md:pt-8 pb-6 md:pb-10">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        {/* <h1 className="text-primary text-left text-base md:text-xl/tight font-semibold">
          Upcoming Events
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 mt-8">
            {events?.map((event) => (
                <FeaturedEventsCard event={event} key={event?._id} />
            ))}
        </div> */}
      </div>
    </section>
  );
};

export default FeaturedEvents;