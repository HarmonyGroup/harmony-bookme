"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EVENT_CATEGORIES } from "@/constants/events";
import { useGetVendorEvents } from "@/services/vendor/event";
import Image from "next/image";
// import EventListingTable from "../events/EventListingTable";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
import { useDebounce } from "use-debounce";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const EventListing = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500); // Debounce search input by 500ms
  const [category, setCategory] = useState("");
  const [pricingType, setPricingType] = useState<"free" | "paid" | "all">(
    "all"
  );

  const { data, isLoading } = useGetVendorEvents({
    page,
    limit,
    search: debouncedSearch,
    category: category || undefined,
    pricingType,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1); // Reset to first page on filter change
  };

  const handlePricingChange = (value: "free" | "paid" | "all") => {
    setPricingType(value);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="p-6">
      <h3 className="text-primary text-xl font-semibold">Events</h3>
      <p className="text-gray-900 text-xs mt-1">
        Create and manage your events here
      </p>
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2.5">
          <div className="relative w-[380px] hidden md:block">
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
              value={search}
              onChange={handleSearchChange}
              className="!w-full !text-xs placeholder:text-gray-700 placeholder:text-xs shadow-none outline-none ring-0 focus:shadow-xs px-4 !py-5 ps-9 bg-accent border-gray-200/60 focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-300"
              placeholder="Search event by title..."
            />
          </div>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[140px] bg-accent text-gray-600 text-xs shadow-none border-gray-200/60 cursor-pointer data-[placeholder]:text-gray-700 focus-visible:ring-0 focus-visible:border-primary py-5">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="all"
                className="text-gray-600 text-xs !py-2.5 cursor-pointer"
              >
                All
              </SelectItem>
              {EVENT_CATEGORIES?.map((cat, index) => (
                <SelectItem
                  value={cat}
                  key={index}
                  className="text-gray-600 text-xs !py-2.5 cursor-pointer"
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handlePricingChange}>
            <SelectTrigger className="w-[140px] bg-accent text-gray-600 text-xs shadow-none cursor-pointer data-[placeholder]:text-gray-700 focus-visible:ring-0 focus-visible:border-primary py-5">
              <SelectValue placeholder="Pricing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="all"
                className="text-gray-600 text-xs !py-2.5 cursor-pointer"
              >
                All
              </SelectItem>
              <SelectItem
                value="free"
                className="text-gray-600 text-xs !py-2.5 cursor-pointer"
              >
                Free
              </SelectItem>
              <SelectItem
                value="paid"
                className="text-gray-600 text-xs !py-2.5 cursor-pointer"
              >
                Paid
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/vendor/events/new"
            className="flex items-center gap-1 bg-primary text-white text-xs/relaxed font-medium rounded-md px-5 py-2.5 hover:bg-primary/90 transition ease-in-out duration-300"
          >
            Create Event
          </Link>
        </div>
      </div>
      {/* <div className="mt-6">
        {isError && (
          <div className="text-center py-10 text-red-500 text-sm">
            Error: {error.message}
          </div>
        )}
        <EventListingTable events={data?.data} isLoading={isLoading} />
        {data?.pagination && data.pagination.total > 0 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p);
                    }}
                    isActive={p === page}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < data.pagination.pages) setPage(page + 1);
                  }}
                  className={
                    page === data.pagination.pages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div> */}

      <div className="h-full mt-6">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="border border-gray-100 shadow-xs rounded-lg p-5"
              >
                <Skeleton className="h-48 w-full rounded-sm mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/3 mb-4" />
                <Skeleton className="h-3 w-full mb-2" />
                <div className="flex items-center justify-between mt-2">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <div className="space-y-1 text-right">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.map((event) => (
              <Link
                key={event?._id}
                href={`/vendor/events/${event?.slug}`}
                className="border border-gray-100 shadow-xs hover:shadow-md rounded-lg transition ease-in-out duration-300 p-5"
              >
                <Image
                  alt=""
                  src="https://img.freepik.com/free-photo/portrait-man-with-fantasy-unicorn-animal-cinematic-atmosphere_23-2151586587.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
                  className="h-48 w-full rounded-sm mb-4"
                  width={300}
                  height={192}
                  priority
                />
                <h1 className="text-primary text-sm font-semibold">
                  {event?.title}
                </h1>
                <p className="text-gray-700 text-[11px]/relaxed mt-2">
                  Saturday Aug 4 8:00PM - 11:00PM
                </p>
                <p className="text-gray-700 text-[11px]/relaxed mt-1">
                  {event?.venueName}
                </p>
                <div className="mt-4">
                  <Progress value={33} />
                  <div className="flex items-center justify-between mt-2">
                    <div className="space-y-1">
                      <p className="text-gray-700 text-[11px]">
                        Event Capacity
                      </p>
                      <p className="text-xs font-semibold">350</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-gray-700 text-[11px]">Tickets Sold</p>
                      <p className="text-xs font-semibold">150</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListing;