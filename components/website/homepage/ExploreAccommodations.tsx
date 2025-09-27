"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ExploreAccommodationsCard from "./ExploreAccommodationsCard";

const ExploreAccommodations = () => {
  const [api, setApi] = useState<CarouselApi>();

  const scrollPrev = () => {
    api?.scrollPrev();
  };

  const scrollNext = () => {
    api?.scrollNext();
  };

  return (
    <section className="bg-white pb-16">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="flex items-center justify-center md:justify-between">
          <h1 className="text-[#183264] text-center text-base md:text-xl/tight font-semibold">
            Find your perfect stay
          </h1>
          <div className="hidden md:flex items-center gap-2">
            <Button
              onClick={scrollPrev}
              className="bg-white text-[#183264] hover:bg-[#183264] hover:text-white size-8 border border-[#183264] rounded-full cursor-pointer transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                stroke="currentColor"
                className="size-3.5 md:size-[17px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </Button>
            <Button
              onClick={scrollNext}
              className="bg-white text-[#183264] hover:bg-[#183264] hover:text-white size-8 border border-[#183264] rounded-full cursor-pointer transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                stroke="currentColor"
                className="size-3.5 md:size-[17px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Button>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full mt-8 md:mt-8"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            <CarouselItem className="pl-2 md:pl-6 basis-full lg:basis-1/3">
              <ExploreAccommodationsCard />
            </CarouselItem>
            <CarouselItem className="pl-2 md:pl-6 basis-full lg:basis-1/3">
              <ExploreAccommodationsCard />
            </CarouselItem>
            <CarouselItem className="pl-2 md:pl-6 basis-full lg:basis-1/3">
              <ExploreAccommodationsCard />
            </CarouselItem>
            <CarouselItem className="pl-2 md:pl-6 basis-full lg:basis-1/3">
              <ExploreAccommodationsCard />
            </CarouselItem>
            <CarouselItem className="pl-2 md:pl-6 basis-full lg:basis-1/3">
              <ExploreAccommodationsCard />
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <div className="md:hidden flex items-center justify-center gap-2 mt-12">
          <Button
            onClick={scrollPrev}
            className="bg-white text-[#183264] hover:bg-[#183264] hover:text-white size-10 border border-[#183264] rounded-full cursor-pointer transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.4"
              stroke="currentColor"
              className="size-[16px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </Button>
          <Button
            onClick={scrollNext}
            className="bg-white text-[#183264] hover:bg-[#183264] hover:text-white size-10 border border-[#183264] rounded-full cursor-pointer transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.4"
              stroke="currentColor"
              className="size-[16px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExploreAccommodations;