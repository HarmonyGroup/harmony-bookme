
import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { EventListing } from "@/types/event";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import Link from "next/link";
import moment from "moment";
import { formatPrice } from "@/lib/utils";
import type { UseEmblaCarouselType } from "embla-carousel-react";

const EventCard = ({ event }: { event?: EventListing }) => {
  // const [isSaved, setIsSaved] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);

  // Listen for slide changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect(); // Set initial slide

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Reset slide when event changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [event?._id]);

  return (
    <div className="grid grid-cols-3 border border-gray-200/80 shadow-xs rounded-lg overflow-hidden bg-white transition-colors ease-in-out duration-300">
      <div className="relative col-span-1 h-52 bg-gray-50 overflow-hidden">
        <Carousel className="w-full h-full" setApi={setApi}>
          <CarouselContent>
            {event?.images?.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-52">
                  <Image
                    src={image}
                    alt={`${event?.title} - Image ${index + 1}`}
                    className="object-cover"
                    fill
                    priority={index === 0}
                    loading="eager"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white cursor-pointer" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white cursor-pointer" />
        </Carousel>
        {/* Rating Badge */}
        {/* <div className="absolute top-2 left-2 bg-white flex items-center gap-1 text-primary text-xs font-semibold rounded-sm px-2 py-1">
          4.8
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-yellow-500 size-[14px] -mt-[2px]"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
        </div> */}

        {/* Carousel Indicator */}
        {event?.images && event.images.length > 1 && (
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium rounded-sm px-2 py-1">
            {currentSlide + 1} / {event.images.length}
          </div>
        )}
      </div>
      <div className="col-span-2 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-primary text-base font-semibold">
              {event?.title}
            </h1>
            {/* <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsSaved(!isSaved)}
                className="bg-inherit cursor-pointer !h-9 !w-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors ease-in-out duration-300"
              >
                {isSaved ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-red-500 size-[22px]"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.2"
                    stroke="currentColor"
                    className="text-gray-600 size-[22px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                )}
              </Button>
            </div> */}
          </div>
          {/* <div className="flex items-center gap-2.5 mt-1.5">
            <span className="text-[11px] text-sky-600 font-medium bg-sky-100/80 px-2 py-1 rounded-md">
              {event?.category}
            </span>
            <span className="text-[11px] text-rose-600 font-medium bg-rose-100/80 px-2 py-1 rounded-md capitalize">
              {event?.pricingType}
            </span>
          </div> */}
          <div className="flex items-center gap-5 mt-3">
            <div className="flex items-center gap-2">
              {/* <CalendarBlankIcon /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="size-[14px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>

              <span className="text-gray-700 text-xs font-medium">
                {moment(event?.startDate).format("MMMM Do YYYY")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="size-[14px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>

              <span className="text-gray-700 text-xs font-medium">
                {event?.venueName}
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mt-3">
            {event?.summary}
          </p>
        </div>

        <div className="flex items-center justify-between">
           <div className="flex items-center gap-1 text-gray-700 text-[13px] font-medium">
             {event?.pricingType === 'free' ? (
               <span className="text-green-600 font-semibold">Free</span>
             ) : event?.tickets && event.tickets.length > 0 ? (
               <>
                 <span className="text-gray-500 text-[11px]">prices from</span> NGN {formatPrice(event.tickets[0].basePrice)}
               </>
             ) : (
               <span className="text-gray-500 text-[11px]">Price TBA</span>
             )}
           </div>
          <div className="flex items-center gap-2.5">
            <Link
              href={`/events/${event?.slug}`}
              className="bg-primary text-white text-xs font-medium rounded-md px-4 py-2 hover:bg-primary/90 transition-colors ease-in-out duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;