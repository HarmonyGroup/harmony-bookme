"use client";

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
import type { UseEmblaCarouselType } from "embla-carousel-react";

const FeaturedEventsCard = ({ event }: { event?: EventListing }) => {
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
    <div className="bg-white transition-all duration-300">
      <div className="flex flex-col">
        {/* Image Carousel Section */}
        <div className="relative h-48 bg-gray-50 rounded-t-2xl overflow-hidden">
          {event?.images && event.images.length > 0 ? (
            <>
              <Carousel className="w-full h-full" setApi={setApi}>
                <CarouselContent className="h-full">
                  {event.images.map((image, index) => (
                    <CarouselItem key={index} className="h-full">
                      <div className="relative w-full h-48">
                        <Image
                          src={image}
                          alt={`${event?.title} - Image ${index + 1}`}
                          className="object-cover rounded-t-2xl"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            console.log("Image failed to load:", image);
                            e.currentTarget.style.display = "none";
                          }}
                          loading="eager"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {event.images.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white text-primary hover:bg-white cursor-pointer border-0 outline-none shadow-sm z-10" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-primary hover:bg-white cursor-pointer border-0 outline-none shadow-sm z-10" />
                  </>
                )}
              </Carousel>

              {/* Dot-style Carousel Indicators */}
              {event.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                  {event.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-white scale-125"
                          : "bg-white/60 hover:bg-white/80"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No images available
            </div>
          )}
        </div>

        {/* Original Content */}
        <span className="text-primary text-[13px] md:text-[15px] font-semibold mt-4">
          {/* {event?.title} */}
          Reckless MusiComedy Festival
        </span>
        <span className="text-gray-700 text-xs mt-1.5">
          {/* {moment(event?.startDate).format("dddd, MMMM Do, YYYY [|] h:mm A")} */}
          {}
          Sun DEC 5 2025 | 6:00 PM
        </span>
        <span className="text-gray-700 text-xs mt-1.5">
          {/* {event?.streetAddress} */}
          Alimosho, Lagos
        </span>
        {/* <div className="flex items-center justify-between mt-4 border-muted border-t pt-4">
          <p className="text-gray-500 text-[11px] md:text-xs">
            from{" "}
            <span className="text-primary text-[13px] md:text-sm font-semibold">
              NGN {formatPrice(event?.tickets?.[0]?.basePrice || 0)}
            </span>
          </p>
          <Link
            href={`/events/${event?.slug}`}
            className="w-fit bg-primary text-white text-[13px] font-semibold rounded-lg px-4 py-2 hover:bg-primary/90 transition-all ease-in-out duration-300 hover:scale-105"
          >
            Book Now
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default FeaturedEventsCard;