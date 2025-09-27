"use client";

import React, { useState } from "react";
import EventBanner from "@/public/assets/sample-shortlet.jpg";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ExploreAccommodationsCard = () => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="group bg-white rounded-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm flex items-center gap-1 text-primary text-xs font-semibold rounded-full px-2.5 py-1.5 shadow-sm z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-yellow-500 size-3"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
          4.8
        </div>

        {/* Save Button */}
        <Button
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm hover:bg-white border-0 shadow-sm p-2 rounded-full z-10 transition-all duration-200 hover:scale-105"
        >
          {isSaved ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-red-500 size-5"
            >
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-gray-600 hover:text-red-500 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          )}
        </Button>

        {/* Image */}
        <div className="relative overflow-hidden">
          <Image
            alt="Nova base apartments Lekki"
            src={EventBanner}
            className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className="py-4">
        <div className="mb-4">
          <h3 className="text-primary text-[15px] font-semibold mb-1 group-hover:text-primary transition-colors">
            Nova base apartments Lekki
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-[15px]"
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
            Victoria Island, Lagos
          </div>
        </div>

        {/* Price and Book Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary text-base font-semibold">NGN 245,000</p>
            <p className="text-gray-500 text-xs">per night</p>
          </div>
          <Link
            href={"/"}
            className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-lg px-6 py-2.5 transition-all duration-200"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExploreAccommodationsCard;