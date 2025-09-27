"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useGetVendorPayments } from "@/services/vendor/payment";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import moment from "moment";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { PAYMENT_STATUSES } from "@/types/vendor/payment";
import { DateRange } from "react-day-picker";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const VendorTransactionsTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data, isLoading } = useGetVendorPayments({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchQuery ?? "",
    status:
      statusFilter !== "all"
        ? (statusFilter as "pending" | "success" | "failed" | "abandoned")
        : undefined,
    startDate: dateRange?.from
      ? moment(dateRange.from).format("YYYY-MM-DD")
      : undefined,
    endDate: dateRange?.to
      ? moment(dateRange.to).format("YYYY-MM-DD")
      : undefined,
  });

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, statusFilter, dateRange]);

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
    <div className="h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative hidden md:block">
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
              placeholder="Search transaction reference here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Clear Filters */}
          {(statusFilter !== "all" || dateRange?.from || dateRange?.to) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter("all");
                setDateRange(undefined);
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear filters
            </Button>
          )}

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-10 bg-white border border-gray-200 text-xs py-5 cursor-pointer text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <FilterIcon className="size-3 text-gray-500" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="all"
                className="text-gray-500 text-xs font-medium cursor-pointer"
              >
                All Status
              </SelectItem>
              {PAYMENT_STATUSES.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  className="text-gray-500 text-xs font-medium cursor-pointer py-2.5"
                >
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] bg-white border border-gray-200 text-gray-500 text-xs font-medium justify-start text-left py-5 cursor-pointer hover:bg-white"
              >
                <CalendarIcon className="mr-2 size-3 text-gray-500" />
                {dateRange?.from ? (
                  dateRange?.to ? (
                    <>
                      {moment(dateRange.from).format("MMM DD")} -{" "}
                      {moment(dateRange.to).format("MMM DD")}
                    </>
                  ) : (
                    moment(dateRange.from).format("MMM DD, YYYY")
                  )
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from || new Date()}
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  if (range?.from && range?.to) {
                    setIsDatePickerOpen(false);
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {isLoading ? (
        <Table className="!px-10 mt-4">
          <TableHeader className="!px-10">
            <TableRow className="bg-muted/90 text-xs !px-10">
              <TableHead className="text-gray-700 font-medium py-5 pl-4">
                Reference
              </TableHead>
              <TableHead className="text-gray-700 font-medium">
                Customer
              </TableHead>
              <TableHead className="text-gray-700 font-medium">
                Booking
              </TableHead>
              <TableHead className="text-gray-700 font-medium">
                Amount
              </TableHead>
              <TableHead className="text-gray-700 font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-700 font-medium">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(7)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="pl-4 py-6">
                  <Skeleton className="h-6 w-[120px] bg-gray-200 rounded-sm" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-[120px] bg-gray-200 rounded-sm" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[100px] bg-gray-200 rounded-sm" />
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : data?.data?.payments?.length ? (
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/90 text-xs !px-10">
                <TableHead className="text-gray-700 font-medium py-6 pl-4">
                  Reference
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Customer
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Booking
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Amount
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.payments?.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell className="text-gray-700 text-xs font-semibold pl-4 py-6">
                    {payment?.paystackReference}
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      {payment?.explorer?.avatar ? (
                        <Image
                          src={payment.explorer.avatar}
                          alt={payment.customerName}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {payment.customerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{payment?.customerName}</p>
                        <p className="text-gray-400 text-[10px]">
                          {payment?.customerEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs font-medium">
                    {payment?.bookingId?.code}
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs font-medium">
                    NGN {formatPrice(payment?.amount)}
                  </TableCell>
                  <TableCell className="">
                    <span
                      className={cn(
                        "text-[11px] capitalize font-medium rounded-md px-2 py-1",
                        payment?.status === "pending" &&
                          "text-amber-700 bg-amber-50 border border-amber-200",
                        payment?.status === "success" &&
                          "text-emerald-700 bg-emerald-50 border border-emerald-200",
                        payment?.status === "failed" &&
                          "text-red-700 bg-red-50 border border-red-200",
                        payment?.status === "abandoned" &&
                          "text-gray-700 bg-gray-50 border border-gray-200"
                      )}
                    >
                      {payment?.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs font-medium">
                    {payment?.paidAt
                      ? moment(payment.paidAt).format("lll")
                      : moment(payment?.createdAt).format("lll")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-20 min-h-[400px]">
          <Image
            src={EmptyIcon}
            className="size-14"
            alt="Harmony Bookme"
            loading="lazy"
          />
          <h1 className="text-gray-700 text-sm font-semibold">
            No transactions found
          </h1>
          <p className="text-gray-500 text-xs text-center max-w-md">
            {searchQuery || statusFilter !== "all" || dateRange
              ? "Try adjusting your filters to see more results."
              : "You haven't received any payments yet."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {data?.data?.payments?.length && (
        <div className="mt-6 w-full flex items-center justify-between">
          <div className="text-xs text-gray-500 whitespace-nowrap">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, data.data.total)} of{" "}
            {data.data.total} transactions
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
    </div>
  );
};

export default VendorTransactionsTable;