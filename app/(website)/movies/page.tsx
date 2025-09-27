"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGetAllMovies } from "@/services/public/movies-and-cinema";
import { useDebounce } from "use-debounce";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import MovieCard from "@/components/website/movies-and-cinema/MovieCard";
import AccommodationCardSkeleton from "@/components/website/accommodations/AccommodationCardSkeleton";
import FilterBox from "@/components/website/movies-and-cinema/FilterBox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Page = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useGetAllMovies({
    page,
    limit,
    search: debouncedSearch,
    genres,
    duration,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="bg-white">
      <section className="relative h-[14vh] md:h-[10vh] w-full bg-primary flex flex-col items-center justify-center overflow-x-hidden">
        <div className="mx-auto w-full max-w-7xl px-5">
          <Image
            src={
              "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004039.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
            }
            layout="fill"
            objectFit="cover"
            alt="Harmony BookMe"
            className="blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-800/80 to-primary/40"></div>
          <div className="relative flex">
            <h1 className="text-white text-left text-lg font-bold md:text-xl/snug max-w-xl">
              Find movies showing near you
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 md:py-16">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="w-full h-full col-span-1 hidden lg:block">
            <FilterBox
              search={search}
              setSearch={setSearch}
              setGenres={setGenres}
              setDuration={setDuration}
            />
          </div>

          <div className="w-full h-full col-span-1 lg:col-span-2">
            <h1 className="text-primary text-base font-semibold">
              Found {data?.pagination?.total || 0} movies
            </h1>

            <div className="flex flex-col gap-4 mt-8">
              {isLoading ? (
                [...Array(7)].map((_, index) => (
                  <AccommodationCardSkeleton key={index} />
                ))
              ) : data?.data?.length ? (
                data?.data?.map((movie) => (
                  <MovieCard key={movie?._id} movie={movie} />
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

            {data?.pagination && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        data.pagination.hasPrev && handlePageChange(page - 1)
                      }
                      className={
                        data.pagination.hasPrev
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-50"
                      }
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: data.pagination.pages },
                    (_, i) => i + 1
                  ).map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={pageNum === page}
                        className={
                          pageNum === page
                            ? "border border-primary text-primary text-xs"
                            : "cursor-pointer"
                        }
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        data.pagination.hasNext && handlePageChange(page + 1)
                      }
                      className={
                        data.pagination.hasNext
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-50"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Page;