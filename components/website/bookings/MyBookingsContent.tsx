"use client";

import * as React from "react";
// import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { useGetExplorerBookings } from "@/services/explorer/booking";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RecentBookingCard from "@/components/website/shared/RecentBookingCard";
import BookingCardSkeleton from "@/components/website/bookings/BookingCardSkeleton";
import Image from "next/image";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import AccommodationBookingCard from "@/components/website/bookings/AccommodationBookingCard";
import { ExplorerBooking } from "@/types/booking";

export default function MyBookingsContent() {
  const [selectedService, setSelectedService] =
    React.useState<string>("events");
  const [searchQuery] = React.useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  
  const { data, isLoading } = useGetExplorerBookings({
    type: selectedService ?? "",
    search: debouncedSearchQuery ?? "",
  });
  const bookings = data?.data?.bookings;

  return (
    <div className="min-h-[90vh] bg-muted/60">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 md:py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <h1 className="text-primary text-xl font-semibold">Bookings</h1>
          <div className="flex items-center gap-2.5">
            <Select
              value={selectedService}
              onValueChange={(value) => setSelectedService(value)}
            >
              <SelectTrigger
                defaultValue={"events"}
                className="min-w-[180px] bg-white text-gray-700 !text-xs font-medium data-[placeholder]:!text-gray-700 placeholder:text-xs placeholder:font-medium shadow-none outline-none ring-0 focus:shadow-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 cursor-pointer !py-5"
              >
                <SelectValue placeholder="Select booking type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="events"
                  className="text-gray-600 text-xs cursor-pointer px-3 py-2.5"
                >
                  Events
                </SelectItem>
                <SelectItem
                  value="accommodations"
                  className="text-gray-600 text-xs cursor-pointer px-3 py-2.5"
                >
                  Accommodations
                </SelectItem>
                <SelectItem
                  value="leisure"
                  className="text-gray-600 text-xs cursor-pointer px-3 py-2.5"
                >
                  Leisure
                </SelectItem>
                <SelectItem
                  value="movies_and_cinema"
                  className="text-gray-600 text-xs cursor-pointer px-3 py-2.5"
                >
                  Movies and cinema
                </SelectItem>
              </SelectContent>
            </Select>

            {/* <div className="relative w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="absolute left-4 top-1/2 -translate-y-1/2 size-[13px] text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <Input
                type="search"
                className="w-[300px] bg-white !text-xs placeholder:text-gray-500 placeholder:text-xs placeholder:font-medium shadow-xs outline-none ring-0 focus:shadow-xs px-4 !py-5 ps-9 border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                placeholder="Search listing or booking code here"
              />
            </div> */}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-6">
          {isLoading ? (
            [...Array(7)].map((_, index) => <BookingCardSkeleton key={index} />)
          ) : bookings?.length ? (
            <>
              {selectedService === "accommodations"
                ? bookings?.map((booking: ExplorerBooking, index: number) => (
                    <AccommodationBookingCard booking={booking} key={index} />
                  ))
                : bookings?.map((booking: ExplorerBooking, index: number) => (
                    <RecentBookingCard booking={booking} key={index} />
                  ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-20 min-h-[400px]">
              <Image
                src={EmptyIcon}
                className="size-14"
                alt="Harmony Bookme"
                loading="lazy"
              />
              <h1 className="text-gray-700 text-sm font-semibold">
                No bookings found
              </h1>
              <p className="text-gray-500 text-xs text-center max-w-md">
                Book {selectedService} and they&apos;ll show up here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
