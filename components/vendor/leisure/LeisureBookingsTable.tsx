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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useGetVendorBookings } from "@/services/vendor/booking";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import moment from "moment";
import BookingDetailsModal from "./BookingDetailsModal";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { BOOKING_STATUSES } from "@/constants/booking-statuses";
import { DateRange } from "react-day-picker";

const LeisureBookingsTable = () => {
  
  const [preview, setPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const { data, isLoading } = useGetVendorBookings({
    search: debouncedSearchQuery ?? "",
    status: statusFilter !== "all" ? statusFilter : "",
    type: "leisure",
    startDate: dateRange?.from
      ? moment(dateRange.from).format("YYYY-MM-DD")
      : undefined,
    endDate: dateRange?.to
      ? moment(dateRange.to).format("YYYY-MM-DD")
      : undefined,
  });

  console.log(data);

  return (
    <>
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
                placeholder="Search booking code here"
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
                {BOOKING_STATUSES.map((status) => (
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
                  Booking code
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Explorer
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Amount
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Date
                </TableHead>
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
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/90 text-xs !px-10">
                  <TableHead className="text-gray-700 font-medium py-6 pl-4">
                    Booking Code
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium">
                    Explorer
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium">
                    Revenue
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium">
                    Date
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-700 font-medium text-right pr-4">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.bookings?.map((booking, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-gray-700 text-xs font-semibold pl-4 py-6">
                      {booking?.code}
                    </TableCell>
                    <TableCell className="text-gray-500 text-xs font-medium capitalize">
                      {booking?.explorer?.firstName}{" "}
                      {booking?.explorer?.lastName}
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
                    <TableCell className="text-gray-500 text-xs text-right pr-4">
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
                            onClick={() => setPreview(true)}
                            className="text-gray-700 text-xs font-medium cursor-pointer"
                          >
                            Booking details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              No leisure bookings found
            </h1>
            <p className="text-gray-500 text-xs text-center max-w-md">
              Receive leisure bookings and they&apos;ll show up here.
            </p>
          </div>
        )}
      </div>
      <BookingDetailsModal
        isOpen={preview}
        onClose={() => setPreview(false)}
        booking={data?.data?.bookings[0]}
      />
    </>
  );
};

export default LeisureBookingsTable;