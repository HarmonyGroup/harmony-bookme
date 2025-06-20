import React from "react";
import { Button } from "@/components/ui/button";
import ExploreAccommodationsCard from "./ExploreAccommodationsCard";

const ExploreAccommodations = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="flex items-center justify-center md:justify-between">
          <h1 className="text-[#183264] text-center text-lg md:text-xl/tight font-medium">
            Find your perfect stay
          </h1>
          <div className="hidden md:flex items-center gap-2">
            <Button className="bg-white text-primary hover:text-white size-8 md:size-9 border border-primary rounded-full cursor-pointer transition-all duration-300">
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
            <Button className="bg-white text-primary hover:text-white size-8 md:size-9 border border-primary rounded-full cursor-pointer transition-all duration-300">
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 mt-12 md:mt-12">
          <ExploreAccommodationsCard />
          <ExploreAccommodationsCard />
          <ExploreAccommodationsCard />
        </div>
         <div className="md:hidden flex items-center justify-center gap-2 mt-12">
            <Button className="bg-white text-primary hover:text-white size-8 md:size-9 border border-primary rounded-full cursor-pointer transition-all duration-300">
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
            <Button className="bg-white text-primary hover:text-white size-8 md:size-9 border border-primary rounded-full cursor-pointer transition-all duration-300">
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
    </section>
  );
};

export default ExploreAccommodations;