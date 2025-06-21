"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import EventBanner from "@/public/assets/sample-shortlet.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import EventPreview from "./EventPreview";

const EventCard = () => {

  const [isSaved, setIsSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  return (
    <>
      <div className="block rounded-lg relative">
        <Button
          onClick={() => setIsSaved(!isSaved)}
          className="absolute left-0 top-0 bg-inherit hover:bg-inherit cursor-pointer"
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
          className="h-56 w-full rounded-t-lg object-cover"
        />
        <div className="bg-white py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-primary text-xs font-semibold">
              Season 2: Femi and the gang
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-white cursor-pointer outline-0 ring-0 rounded-full p-1 hover:bg-primary/5 duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.7"
                  stroke="currentColor"
                  className="text-primary size-[21px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setPreview(!preview)}
                  className="text-gray-600 text-xs font-medium cursor-pointer focus:text-primary duration-300"
                >
                  Quick view
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-gray-600 text-xs mt-1">Yaba, Lagos</p>
          <p className="text-gray-600 text-xs mt-1.5">Thu Jun 24, 9:00 AM</p>
          <div className="flex items-center justify-between text-primary text-xs md:text-[13px] font-semibold mt-8">
            <div className="flex -space-x-3.5 rtl:space-x-reverse">
              <Image
                className="size-7 border-2 border-white rounded-full dark:border-gray-800"
                src={EventBanner}
                alt=""
              />
              <Image
                className="size-7 border-2 border-white rounded-full dark:border-gray-800"
                src={EventBanner}
                alt=""
              />
              <Image
                className="size-7 border-2 border-white rounded-full dark:border-gray-800"
                src={EventBanner}
                alt=""
              />
              <a
                className="flex items-center justify-center size-7 text-[11px] font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800 px-5"
                href="#"
              >
                +99
              </a>
            </div>

            <Link
              href={"/"}
              className="flex items-center gap-1.5 bg-white hover:bg-primary text-primary hover:text-white text-xs font-semibold border border-primary rounded-full px-2.5 py-1.5 transition duration-300"
            >
              Buy Tickets
            </Link>
          </div>
        </div>
      </div>
      {/* <EventPreview
        showModal={preview}
        toggleModal={() => setPreview(!preview)}
      /> */}
    </>
  );
};

export default EventCard;