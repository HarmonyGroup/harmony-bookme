"use client";

import React, { useState } from "react";
import EventBanner from "@/public/assets/sample-shortlet.jpg";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ExploreAccommodationsCard = () => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="block rounded-lg relative">
      <div className="absolute top-2.5 left-2.5 bg-white flex items-center gap-1 text-primary text-xs font-semibold rounded px-2 py-1">
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
      </div>
      <Button
        onClick={() => setIsSaved(!isSaved)}
        className="absolute right-0 top-0 bg-inherit hover:bg-inherit cursor-pointer"
      >
        {isSaved ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-red-500 size-6"
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
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        )}
      </Button>
      <Image
        alt=""
        src={EventBanner}
        className="h-56 w-full rounded-lg object-cover mb-5"
      />
      <h3 className="text-primary text-sm font-medium mt-4 sm:mt-3.5">
        Nova base apartments Lekki
      </h3>
      <p className="text-gray-500 text-xs mt-1.5">Victoria Island, Lagos</p>
      <div className="flex items-center justify-between text-primary text-xs md:text-[13px] font-semibold mt-6">
        <p>from ₦245k / Night</p>
        <Link
          href={"/"}
          className="flex items-center gap-1.5 bg-white hover:bg-primary text-primary hover:text-white text-xs font-semibold border border-primary rounded-full px-3 py-2 transition duration-300"
        >
          Book Now
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="size-[11px] mt-[1px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg> */}
        </Link>
      </div>
    </div>
  );
};

export default ExploreAccommodationsCard;