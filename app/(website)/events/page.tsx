"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import FilterBox from "@/components/website/events/FilterBox";
import EventCard from "@/components/website/events/EventCard";
import { useGetAllEvents } from "@/services/public/event";
import { useDebounce } from "use-debounce";
import EventCardSkeleton from "@/components/website/events/EventCardSkeleton";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const Page = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [category, setCategory] = useState("");
  const [pricingType, setPricingType] = useState("");
  const [eventFormat, setEventFormat] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { data, isLoading } = useGetAllEvents({
    page,
    limit,
    search: debouncedSearch,
    category,
    pricingType,
    eventFormat,
    date,
  });

  const handleNextPage = () => {
    if (data?.pagination.hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (data?.pagination.hasPrev) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Generate page numbers for pagination (matching AdminTransactionsTable style)
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = data?.pagination.pages || 1;
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, page - 2);
      const end = Math.min(totalPages, page + 2);

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("ellipsis");
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("ellipsis");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, pricingType, eventFormat, date]);

  return (
    <section className="bg-muted/50">
      <section className="relative h-[8vh] md:h-[10vh] w-full bg-primary flex flex-col items-center justify-center overflow-x-hidden">
        <div className="mx-auto w-full max-w-7xl px-4">
          <Image
            src={
              "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004039.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
            }
            layout="fill"
            objectFit="cover"
            alt="Harmony BookMe"
            className="blur-[1px]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-800/80 to-primary/40"></div>
          <div className="relative flex">
            <h1 className="text-white text-left text-base font-bold md:text-xl/snug max-w-xl">
              Find events happening near you
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 md:py-16">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-28">
          <div className="w-full h-full col-span-1 hidden lg:block">
            <FilterBox
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              pricingType={pricingType}
              setPricingType={setPricingType}
              eventFormat={eventFormat}
              setEventFormat={setEventFormat}
              date={date}
              setDate={setDate}
            />
          </div>
          <div className="w-full h-full col-span-1 lg:col-span-2">
            <h1 className="text-primary text-base font-semibold">
              Found {data?.pagination?.total || 0} events
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            {isLoading ? (
                [...Array(6)].map((_, index) => (
                  <EventCardSkeleton key={index} />
                ))
              ) : data?.data?.length ? (
                data?.data?.map((event, index) => (
                  <EventCard event={event} key={index} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-20 min-h-[400px]">
                  <Image
                    src={EmptyIcon}
                    className="size-14"
                    alt="Harmony Bookme"
                    loading="lazy"
                  />
                  <h1 className="text-gray-700 text-sm font-semibold">
                    Sorry can&apos;t find what you&apos;re looking for
                  </h1>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {data?.data?.length && (
              <div className="mt-6 w-full flex items-center justify-between">
                <div className="text-[13px] text-gray-700 whitespace-nowrap">
                  Showing results {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, data.pagination.total)} of{" "}
                  {data.pagination.total}
                </div>
                <Pagination className="mx-0 w-auto justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={handlePrevPage}
                        className={
                          !data?.pagination.hasPrev
                            ? "pointer-events-none opacity-50 text-[13px]"
                            : "cursor-pointer text-[13px] text-gray-600 hover:bg-transparent"
                        }
                      />
                    </PaginationItem>
                    
                    {generatePageNumbers().map((pageNum, index) => (
                      <PaginationItem key={index}>
                        {pageNum === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum as number)}
                            isActive={pageNum === data?.pagination.page}
                            className="cursor-pointer text-[13px]"
                            size="sm"
                          >
                            {pageNum}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={handleNextPage}
                        className={
                          !data?.pagination.hasNext
                            ? "pointer-events-none opacity-50 text-[13px]"
                            : "cursor-pointer text-[13px] text-gray-600 hover:bg-transparent"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};


export default Page;