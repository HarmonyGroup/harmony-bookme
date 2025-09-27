"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { useGetVendorBookings } from "@/services/vendor/booking";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, copyToClipboard, formatPrice } from "@/lib/utils";
// import { useUpdateBookingStatus } from "@/services/vendor/booking";
import moment from "moment";
import BookingDetailsModal from "../leisure/BookingDetailsModal";
import { ExplorerBooking } from "@/types/booking";

const RecentBookings = () => {
  const [preview, setPreview] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<ExplorerBooking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  // const [status, setStatus] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useGetVendorBookings({
    page: currentPage,
    limit,
    type: "movies_and_cinema",
    search: debouncedSearch,
  });

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Pagination calculations
  const totalPages = data?.data ? Math.ceil(data.data.total / limit) : 0;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination with ellipsis
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

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

  // const { mutate, isPending } = useUpdateBookingStatus();

  // const handleUpdateStatus = (bookingId: string, status: string) => {
  //   const toastId = toast.loading("Updating status...");
  //   const payload = {
  //     bookingId: bookingId,
  //     status: status,
  //   };

  //   mutate(payload, {
  //     onSuccess: (response) => {
  //       toast.success(
  //         response?.message ?? `Booking status updated successfully`,
  //         { id: toastId }
  //       );
  //     },
  //     onError: (error) => {
  //       toast.error(error?.message ?? "Failed to update status", {
  //         id: toastId,
  //       });
  //     },
  //   });
  // };

  return (
    <>
      <div className="bg-white rounded-lg shadow-xs p-4">

        <div className="flex items-center justify-between">
          <h1 className="text-primary text-sm font-semibold">
            Recent Bookings
          </h1>
          <div className="relative hidden md:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              stroke="currentColor"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[13px] text-gray-500 mt-[0.5px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <Input
              type="search"
              className="w-[320px] bg-muted/95 !text-xs placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal outline-none ring-0 shadow-none px-4 !py-5 ps-9 border-none rounded-full focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
              placeholder="Search booking code here"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          {isLoading ? (
            <Table className="mt-4">
              <TableHeader>
                <TableRow className="bg-muted/90 text-xs">
                  <TableHead className="text-gray-700 font-medium py-4 pl-4">
                    Booking Code
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium py-4">
                    Explorer
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium py-4">
                    Revenue
                  </TableHead>
                  {/* <TableHead className="text-gray-700 font-medium py-4">
                    Charges
                  </TableHead> */}
                  <TableHead className="text-gray-700 font-medium py-4">
                    Date
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium py-4">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium py-4 text-right pr-4">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="py-4 pl-4">
                      <Skeleton className="h-4 w-[100px] bg-gray-200 rounded-sm" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 bg-gray-200 rounded-full" />
                        <Skeleton className="h-4 w-[150px] bg-gray-200 rounded-sm" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-[80px] bg-gray-200 rounded-sm" />
                    </TableCell>
                    {/* <TableCell className="py-4">
                      <Skeleton className="h-4 w-[80px] bg-gray-200 rounded-sm" />
                    </TableCell> */}
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-[100px] bg-gray-200 rounded-sm" />
                    </TableCell>
                    <TableCell className="py-4 text-right pr-4">
                      <Skeleton className="h-4 w-4 ml-auto bg-gray-200 rounded-sm" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : data?.data?.bookings?.length ? (
            <Table className="mt-4">
              <TableHeader>
                <TableRow className="bg-muted/90 text-xs border-none">
                  <TableHead className="text-gray-700 font-medium py-5 pl-4">
                    Booking Code
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium py-4">
                    Explorer
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium py-4">
                    Revenue
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium py-4">
                    Date
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium py-4">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium py-4 text-right pr-4">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.bookings?.map((booking) => (
                  <TableRow
                    key={String(booking?._id)}
                    className="border-gray-200/60"
                  >
                    <TableCell className="py-7 pl-4 align-middle">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-xs font-semibold">
                          {booking?.code}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.7"
                          stroke="currentColor"
                          className="size-4 cursor-pointer text-gray-500 hover:text-gray-700"
                          onClick={() => copyToClipboard(String(booking?.code))}
                          aria-label={`Copy booking code ${booking?.code}`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                          />
                        </svg>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center bg-sky-700 text-white text-[11px] font-semibold size-6 rounded-full">
                          {booking?.explorer?.firstName?.[0]}
                        </div>
                        <span className="text-gray-700 text-xs font-medium truncate max-w-[150px]">
                          {booking?.explorer?.firstName}{" "}
                          {booking?.explorer?.lastName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 align-middle text-gray-700 text-xs font-medium">
                      NGN {formatPrice(Math.floor(booking?.totalAmount))}
                    </TableCell>

                    <TableCell className="py-4 align-middle text-gray-700 text-xs font-medium">
                      {moment(booking?.createdAt).format("ll")}
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          "text-[11px] capitalize font-medium rounded-md px-2 py-1",
                          booking?.status === "pending" &&
                            "text-amber-700 bg-amber-50 border-none border-amber-50",
                          booking?.status === "confirmed" &&
                            "text-emerald-700 bg-emerald-50 border-none border-emerald-50",
                          booking?.status === "cancelled" &&
                            "text-red-700 bg-red-50 border-none border-red-50",
                          booking?.status === "failed" &&
                            "text-rose-700 bg-rose-50 border-none border-rose-50"
                        )}
                      >
                        {booking?.status}
                      </span>
                    </TableCell>
                    
                    <TableCell className="py-4 align-middle text-right pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer hover:bg-muted rounded-md transition-colors ease-in-out duration-300 p-0.5 focus-visible:outline-0">
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
                            onClick={() => {
                              setSelectedBooking(booking);
                              setPreview(true);
                            }}
                            className="text-gray-700 text-xs font-medium cursor-pointer"
                          >
                            Booking Details
                          </DropdownMenuItem>
                          {/* <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="text-gray-700 text-xs font-normal cursor-pointer flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.8"
                                stroke="currentColor"
                                className="size-[14px]"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                              Update Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="ml-3">
                              {BOOKING_STATUSES.filter(
                                (status) => status.value !== "pending"
                              ).map((status) => (
                                <DropdownMenuItem
                                  key={status.value}
                                  className="text-gray-700 text-xs font-normal cursor-pointer flex items-center gap-2"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      String(booking._id),
                                      status.value
                                    )
                                  }
                                  disabled={isPending}
                                >
                                  <CircleIcon
                                    className={`${status.colorClass} !bg-inherit !size-[7px]`}
                                    weight="fill"
                                  />
                                  <span>{status.label}</span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub> */}
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
                No bookings found
              </h1>
              <p className="text-gray-500 text-xs text-center max-w-md">
                Accept bookings and they&apos;ll show up here.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data?.data?.bookings?.length && (
          <div className="mt-6 w-full flex items-center justify-between">
            <div className="text-xs text-gray-500 whitespace-nowrap">
              Showing {(currentPage - 1) * limit + 1} to{" "}
              {Math.min(currentPage * limit, data.data.total)} of{" "}
              {data.data.total} bookings
            </div>

            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      hasPreviousPage && handlePageChange(currentPage - 1)
                    }
                    className={
                      hasPreviousPage
                        ? "cursor-pointer text-gray-600 text-xs"
                        : "text-xs cursor-not-allowed pointer-events-none opacity-50"
                    }
                  />
                </PaginationItem>

                {generatePageNumbers().map((pageNum, index) => (
                  <PaginationItem key={index}>
                    {pageNum === "ellipsis" ? (
                      <PaginationEllipsis className="text-gray-600" />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum as number)}
                        isActive={pageNum === currentPage}
                        className={
                          pageNum === currentPage
                            ? "bg-muted text-primary text-xs cursor-pointer shadow-none border-none"
                            : "cursor-pointer text-gray-600 text-xs"
                        }
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      hasNextPage && handlePageChange(currentPage + 1)
                    }
                    className={
                      hasNextPage
                        ? "cursor-pointer text-gray-600 text-xs"
                        : "cursor-not-allowed pointer-events-none opacity-50 text-xs"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <BookingDetailsModal
        isOpen={preview}
        onClose={() => {
          setPreview(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
      />
    </>
  );
};

export default RecentBookings;