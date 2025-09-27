import { Input } from "@/components/ui/input";
import {
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatPrice, cn } from "@/lib/utils";
import { useGetVendorBookings } from "@/services/vendor/booking";
import Image from "next/image";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import BookingDetailsModal from "../leisure/BookingDetailsModal";
import { ExplorerBooking } from "@/types/booking";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface RecentBookingsTableProps {
  type: string;
}

const RecentBookingsTable = ({ type }: RecentBookingsTableProps) => {
  const [preview, setPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [statusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] =
    useState<ExplorerBooking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { data, isLoading } = useGetVendorBookings({
    page: currentPage,
    type,
    search: debouncedSearchQuery ?? "",
    status: statusFilter !== "all" ? statusFilter : "",
    limit: itemsPerPage,
  });

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, statusFilter]);

  // Pagination calculations
  const totalPages = data?.data ? Math.ceil(data.data.total / itemsPerPage) : 0;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
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

  return (
    <div className="bg-white border border-gray-100/80 rounded-lg shadow-xs p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-primary text-[13px] font-semibold">
          Recent Bookings
        </h3>
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
            className="w-[300px] bg-white !text-xs placeholder:text-gray-500 placeholder:text-xs placeholder:font-medium shadow-xs outline-none ring-0 focus:shadow-xs px-4 !py-5 ps-9 border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            placeholder="Search booking code here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <Table className="!px-10 mt-4">
          <TableHeader className="!px-10">
            <TableRow className="bg-muted/90 text-xs !px-10">
              <TableHead className="text-gray-700 font-medium py-5 pl-4">
                Booking Code
              </TableHead>
              <TableHead className="text-gray-700 font-medium">
                Explorer
              </TableHead>
              <TableHead className="text-gray-700 font-medium">
                Amount
              </TableHead>
              <TableHead className="text-gray-700 font-medium">Date</TableHead>
              <TableHead className="text-gray-700 font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-700 font-medium text-right pr-4">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(7)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="pl-4 py-6">
                  <div className="flex items-center gap-2.5">
                    {/* <Skeleton className="h-6 w-6 bg-gray-200 rounded-sm" /> */}
                    <Skeleton className="h-6 w-[120px] bg-gray-200 rounded-sm" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-[120px] bg-gray-200 rounded-sm" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[80px] bg-gray-200 rounded-sm" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[100px] bg-gray-200 rounded-sm" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[100px] bg-gray-200 rounded-sm" />
                </TableCell>
                <TableCell className="text-right pr-4">
                  <Skeleton className="h-6 w-6 ml-auto bg-gray-200 rounded-sm" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : data?.data?.bookings?.length ? (
        <Table className="!px-10 mt-4">
          <TableHeader className="!px-10">
            <TableRow className="bg-muted/90 text-xs !px-10">
              <TableHead className="text-gray-700 font-medium py-6 pl-4">
                Booking Code
              </TableHead>
              <TableHead className="text-gray-700 font-medium">
                Explorer
              </TableHead>
              <TableHead className="text-gray-700 font-medium">
                Amount
              </TableHead>
              <TableHead className="text-gray-700 font-medium">Date</TableHead>
              <TableHead className="text-gray-700 font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-700 font-medium text-right pr-4">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.bookings?.map((booking) => (
              <TableRow key={String(booking?._id)}>
                <TableCell className="py-6 pl-4 align-middle">
                  <span className="text-gray-700 text-xs font-semibold">
                    {booking?.code}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500 text-xs font-medium capitalize">
                  {booking?.explorer?.firstName} {booking?.explorer?.lastName}
                </TableCell>
                <TableCell className="text-gray-500 text-xs font-medium">
                  NGN {formatPrice(booking?.totalAmount)}
                </TableCell>
                <TableCell className="text-gray-500 text-xs font-medium">
                  {moment(booking?.createdAt).format("lll")}
                </TableCell>
                <TableCell className="">
                  <span
                    className={cn(
                      "text-[11px] capitalize font-medium rounded-md px-2 py-1",
                      booking?.status === "pending" &&
                        "text-amber-700 bg-amber-50 border border-amber-200",
                      booking?.status === "confirmed" &&
                        "text-emerald-700 bg-emerald-50 border border-emerald-200",
                      booking?.status === "cancelled" &&
                        "text-red-700 bg-red-50 border border-red-200",
                      booking?.status === "failed" &&
                        "text-rose-700 bg-rose-50 border border-rose-200"
                    )}
                  >
                    {booking?.status}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer hover:bg-muted rounded-md transition-colors ease-in-out duration-300 p-1 focus-visible:outline-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-[20px] text-gray-500"
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
                        className="text-gray-700 text-xs font-medium cursor-pointer hover:bg-muted"
                      >
                        Booking details
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem> */}
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
            No bookings yet
          </h1>
          <p className="text-gray-500 text-xs text-center max-w-md">
            Start accepting bookings and they&apos;ll show up here.
          </p>
        </div>
      )}

      {/* Pagination */}
      {data?.data?.bookings?.length && totalPages > 1 && (
        <div className="mt-6 w-full flex items-center justify-between">
          <div className="text-xs text-gray-500 whitespace-nowrap">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, data.data.total)} of{" "}
            {data.data.total} bookings
          </div>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    hasPreviousPage && handlePageChange(currentPage - 1)
                  }
                  className={cn(
                    "cursor-pointer text-xs",
                    !hasPreviousPage && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {generatePageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer text-xs"
                      size={"sm"}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    hasNextPage && handlePageChange(currentPage + 1)
                  }
                  className={cn(
                    "cursor-pointer text-xs",
                    !hasNextPage && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {preview && (
        <BookingDetailsModal
          isOpen={preview}
          onClose={() => setPreview(false)}
          booking={selectedBooking ?? undefined}
        />
      )}
    </div>
  );
};

export default RecentBookingsTable;