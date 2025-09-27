"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { useGetVendorMovies } from "@/services/vendor/movies-and-cinema";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import Link from "next/link";

// Interface for movie data (aligned with MongoDB schema and API response)
// interface Movie {
//   _id: string;
//   slug: string;
//   title: string;
//   movieCode: string;
//   images: string[];
//   cinema: { title: string };
//   showtimes: { date: string; startTime: string; endTime?: string }[];
//   duration?: number;
// }

// Utility function to calculate endTime from startTime and duration
// const calculateEndTime = (
//   startTime: string,
//   duration: number | undefined,
//   date: string
// ): string | null => {
//   if (!duration || !startTime || !date) return null;

//   // Parse date (ISO string, e.g., "2025-07-24T00:00:00.000Z") and startTime (e.g., "14:30")
//   const [hours, minutes] = startTime.split(":").map(Number);
//   const showDate = moment(date).set({
//     hour: hours,
//     minute: minutes,
//     second: 0,
//     millisecond: 0,
//   });

//   // Add duration (in minutes)
//   const endDate = showDate.clone().add(duration, "minutes");

//   // Format as HH:mm
//   return endDate.format("HH:mm");
// };

// Utility function to determine movie status
// const getMovieStatus = (
//   showtimes: Movie["showtimes"],
//   duration: number | undefined
// ): string => {
//   if (!showtimes?.length || !duration) return "Unknown";

//   const now = moment(); // Current time in local time (WAT)
//   let hasNowShowing = false;
//   let hasUpcoming = false;

//   for (const showtime of showtimes) {
//     const startDateTime = moment(showtime.date).set({
//       hour: Number(showtime.startTime.split(":")[0]),
//       minute: Number(showtime.startTime.split(":")[1]),
//       second: 0,
//       millisecond: 0,
//     });

//     const endTime = calculateEndTime(
//       showtime.startTime,
//       duration,
//       showtime.date
//     );
//     if (!endTime) continue;

//     const [endHours, endMinutes] = endTime.split(":").map(Number);
//     const endDateTime = startDateTime
//       .clone()
//       .set({ hour: endHours, minute: endMinutes });

//     if (now.isBetween(startDateTime, endDateTime, undefined, "[]")) {
//       hasNowShowing = true; // Current time is between start and end (inclusive)
//     } else if (now.isBefore(startDateTime)) {
//       hasUpcoming = true; // Current time is before start
//     }
//   }

//   // Status priority: Now showing > Upcoming > Past
//   if (hasNowShowing) return "Now showing";
//   if (hasUpcoming) return "Upcoming";
//   // All showtimes are past if no "Now showing" or "Upcoming"
//   return "Past";
// };

const AllMoviesTable = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data: movies, isLoading } = useGetVendorMovies({
    page,
    limit,
    search: debouncedSearch,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <>
      <div className="h-full">
        <div className="flex items-center justify-between">
          <div className="relative hidden md:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="absolute left-4 top-1/2 -translate-y-1/2 size-[13px] text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <Input
              type="search"
              className="w-[400px] bg-white !text-xs placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal shadow-none outline-none ring-0 focus:shadow-xs px-4 !py-5 ps-9 border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
              placeholder="Search movies here"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {isLoading ? (
          <Table className="!px-10 mt-4">
            <TableHeader className="!px-10">
              <TableRow className="bg-white text-xs !px-10">
                <TableHead className="text-gray-700 font-medium py-5 pl-4">
                  Movie Name
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Cinema
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Showtimes
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Tickets Sold
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Total Revenue
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-right pr-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(7)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-4 py-5">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-6 w-6 bg-gray-200 rounded-sm" />
                      <Skeleton className="h-4 w-[200px] bg-gray-200 rounded-sm" />
                    </div>
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-[100px] bg-gray-200 rounded-sm" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-[100px] bg-gray-200 rounded-sm" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-[100px] bg-gray-200 rounded-sm" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-[100px] bg-gray-200 rounded-sm" />
                  </TableCell>
                  
                  <TableCell className="text-right pr-4">
                    <Skeleton className="h-4 w-4 ml-auto bg-gray-200 rounded-sm" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : movies?.data?.length ? (
          <Table className="!px-10 mt-4">
            <TableHeader className="!px-10">
              <TableRow className="bg-white text-xs !px-10">
                <TableHead className="text-gray-700 font-medium py-5 pl-4">
                  Movie Name
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Cinema
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Showtimes
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Tickets Sold
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Total Revenue
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-right pr-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies?.data?.map((movie) => (
                <TableRow key={movie?._id}>
                  <TableCell className="text-gray-700 text-xs font-semibold pl-4 py-5">
                    <Link
                      href={`/vendor/movies/${movie?.slug}`}
                      className="flex items-center gap-2.5"
                    >
                      <div className="relative size-8 bg-gray-100 rounded-full overflow-hidden">
                        <Image
                          src={movie?.images?.[0]}
                          alt={movie?.title}
                          className="object-cover"
                          fill
                        />
                      </div>
                      {movie?.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-700 text-xs font-medium">
                    {movie?.cinema?.title}
                  </TableCell>
                  {/* <TableCell className="text-gray-700 text-xs">
                    <Badge
                      variant="default"
                      className="!text-[11px] font-medium capitalize px-2.5 py-1 border-none shadow-none"
                      style={{
                        backgroundColor:
                          getMovieStatus(movie.showtimes, movie.duration) ===
                          "Now showing"
                            ? "#15803d"
                            : getMovieStatus(
                                movie.showtimes,
                                movie.duration
                              ) === "Upcoming"
                            ? "#1d4ed8"
                            : getMovieStatus(
                                movie.showtimes,
                                movie.duration
                              ) === "Past"
                            ? "#b91c1c"
                            : "#6b7280",
                      }}
                    >
                      {getMovieStatus(movie.showtimes, movie.duration)}
                    </Badge>
                  </TableCell> */}
                  <TableCell>
                    <span className="bg-sky-100 text-sky-500 text-xs font-medium rounded-full px-2.5 py-1">{movie?.showtimes?.length}</span>
                  </TableCell>
                  <TableCell className="text-gray-700 text-xs font-medium">---</TableCell>
                  <TableCell className="text-gray-700 text-xs font-medium">---</TableCell>
                  <TableCell className="text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer hover:bg-white rounded-md transition-colors ease-in-out duration-300 p-1 focus-visible:outline-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-[20px]"
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
                          onClick={() =>
                            router.push(`/vendor/movies/${movie?.slug}`)
                          }
                          className="text-gray-700 text-xs font-medium cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.7"
                            stroke="currentColor"
                            className="text-gray-700 size-[14px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/vendor/movies/${movie?.slug}/edit`)
                          }
                          className="text-gray-700 text-xs font-medium cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.7"
                            stroke="currentColor"
                            className="text-gray-700 size-[14px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-gray-700 text-xs font-medium cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.7"
                            stroke="currentColor"
                            className="text-gray-700 size-[14px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-20 min-h-[400px]">
            <Image
              src={EmptyIcon}
              className="size-14"
              alt="Harmony Bookme"
              loading="lazy"
            />
            <h1 className="text-gray-700 text-sm font-semibold">
              No movie found
            </h1>
            <p className="text-gray-500 text-xs text-center max-w-md">
              Create movies and they&apos;ll show up here.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AllMoviesTable;