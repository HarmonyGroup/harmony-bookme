"use client";

import React from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Details from "./Details";
import Amenities from "./Amenities";
import Policies from "./Policies";
import Reviews from "./Reviews";

const LeftSide = () => {
  return (
    <div>
      <div className="grid gap-2 sm:gap-3 lg:grid-cols-3">
        {/* Large Image */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden lg:col-span-2">
          <Image
            src="https://cf.bstatic.com/xdata/images/hotel/max500/625892495.jpg?k=e2985e1a2c237837e8e493b96dec9cbf0ae8249564a61e105d14d5fc8e40c682&o="
            alt="Hotel main"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 66vw, 100vw"
          />
        </div>

        {/* Small Images */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-1">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="https://cf.bstatic.com/xdata/images/hotel/max500/400905159.jpg?k=f9a6a23ac2b0d44564303f8c0441be3e2366de67cc1ad94118aa457a871d11b8&o="
              alt="Hotel 1"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, 50vw"
            />
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="https://cf.bstatic.com/xdata/images/hotel/max300/625892506.jpg?k=ff0ef455570df780ec6ad474681b285f20de92861ad63a6d10201e6b1ccf62ab&o="
              alt="Hotel 2"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, 50vw"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <Tabs defaultValue="details">
          <TabsList className="w-full space-x-4 block bg-white border-b rounded-none !py-0 mb-4 sm:mb-6">
            <TabsTrigger
              value="details"
              className="text-primary !text-xs md:!text-[13px] font-semibold !shadow-none data-[state=active]:!border-b-[2px] data-[state=active]:border-primary data-[state=active]:border-x-0 data-[state=active]:border-t-0 focus-visible:!border-b rounded-none cursor-pointer px-2 md:px-4"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="amenities"
              className="text-primary !text-xs md:!text-[13px] font-semibold !shadow-none data-[state=active]:!border-b-[2px] data-[state=active]:border-primary data-[state=active]:border-x-0 data-[state=active]:border-t-0 focus-visible:!border-b rounded-none cursor-pointer px-2 md:px-4"
            >
              Amenities
            </TabsTrigger>
            <TabsTrigger
              value="policies"
              className="text-primary !text-xs md:!text-[13px] font-semibold !shadow-none data-[state=active]:!border-b-[2px] data-[state=active]:border-primary data-[state=active]:border-x-0 data-[state=active]:border-t-0 focus-visible:!border-b rounded-none cursor-pointer px-2 md:px-4"
            >
              Policies
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="text-primary !text-xs md:!text-[13px] font-semibold !shadow-none data-[state=active]:!border-b-[2px] data-[state=active]:border-primary data-[state=active]:border-x-0 data-[state=active]:border-t-0 focus-visible:!border-b rounded-none cursor-pointer px-2 md:px-4"
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Details />
          </TabsContent>
          <TabsContent value="amenities">
            <Amenities />
          </TabsContent>
          <TabsContent value="policies">
            <Policies />
          </TabsContent>
          <TabsContent value="reviews">
            <Reviews />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LeftSide;
