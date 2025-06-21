import React from "react";
import Image from "next/image";
import FilterBox from "@/components/website/events/FilterBox";
import HeaderBG from "@/public/assets/homepage-hero-background.jpg";
import EventCard from "@/components/website/events/EventCard";

const Page = () => {
  return (
    <div>
      <section className="relative h-[14vh] md:h-[20vh] w-full bg-primary flex flex-col items-center justify-center overflow-x-hidden">
        <div className="mx-auto w-full max-w-7xl px-5">
          <Image
            src={HeaderBG}
            layout="fill"
            objectFit="cover"
            alt="Harmony BookMe"
            className="blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-primary/40"></div>
          <div
            className="relative flex "
            // ref={heroRef}
          >
            <h1 className="text-white text-left text-lg font-bold md:text-2xl/snug max-w-xl">
              Find events happening near you
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 md:py-16">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="w-full h-full col-span-1 hidden lg:block">
            <FilterBox />
          </div>
          <div className="w-full h-full col-span-1 lg:col-span-2">
            <div className="w-full h-full">
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium">Found 300 results</p>
                <div className="md:flex items-center gap-1 rounded-md p-1">
                  <button className="cursor-pointer rounded-sm px-2.5 py-1 hover:bg-gray-200/65 duration-300 transition-all ease-in-out">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.4"
                      stroke="currentColor"
                      className="text-gray-600 size-[18px]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                  </button>
                  <button className="cursor-pointer rounded-sm px-2.5 py-1 hover:bg-gray-200/65 duration-300 transition-all ease-in-out">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.4"
                      stroke="currentColor"
                      className="text-gray-600 size-[18px]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 lg:gap-y-8 mt-4">
                <EventCard />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;