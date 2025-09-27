import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
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
import { Badge } from "@/components/ui/badge";
import { copyToClipboard, formatPrice } from "@/lib/utils";
import moment from "moment";
import { useGetVendorBookings } from "@/services/vendor/booking";
import Image from "next/image";
import EmptyIcon from "@/public/assets/empty-data-icon.png";

const RecentBookings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [statusFilter] = useState("all");

  const { data } = useGetVendorBookings({
    search: debouncedSearchQuery ?? "",
    status: statusFilter !== "all" ? statusFilter : "",
  });

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
            className="w-[400px] bg-white !text-xs placeholder:text-gray-700 placeholder:text-xs placeholder:font-medium shadow-xs outline-none ring-0 focus:shadow-xs px-4 !py-5 ps-9 border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            placeholder="Search event here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {data?.data?.bookings?.length ? (
        <Table className="!px-10 mt-4">
          <TableHeader className="!px-10">
            <TableRow className="bg-muted/90 text-xs !px-10">
              <TableHead className="text-gray-700 font-medium py-5 pl-4">
                Event
              </TableHead>
              <TableHead className="text-gray-700 font-medium">
                Booking code
              </TableHead>
              <TableHead className="text-gray-700 font-medium">
                Total paid
              </TableHead>
              <TableHead className="text-gray-700 font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-700 font-medium">Date</TableHead>
              <TableHead className="text-gray-700 font-medium text-right pr-4">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.bookings?.map((booking, index) => (
              <TableRow key={index}>
                <TableCell className="text-gray-700 text-xs font-semibold pl-4 py-5">
                  {booking?.listing?.title}
                </TableCell>
                <TableCell className="text-gray-700 text-xs uppercase">
                  <div className="flex items-center gap-2">
                    {booking?.code}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.7"
                      stroke="currentColor"
                      className="size-[15px] cursor-pointer"
                      onClick={() => copyToClipboard(booking?.code)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                      />
                    </svg>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 text-xs">
                  NGN {formatPrice(booking?.totalAmount)}
                </TableCell>

                <TableCell className="text-gray-700 text-xs capitalize">
                  <Badge
                    variant={"destructive"}
                    className="!text-[10px] font-medium px-2.5 py-1"
                  >
                    {booking?.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700 text-xs capitalize">
                  {moment(booking?.createdAt).format("ll")}
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
                        className="size-[22px]"
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
                        // onClick={() => setPreview(true)}
                        className="text-gray-700 text-xs font-medium cursor-pointer"
                      >
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-700 text-xs font-medium cursor-pointer">
                        Cancel booking
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
            No bookings yet
          </h1>
          <p className="text-gray-500 text-xs text-center max-w-md">
            Start accepting bookings and they&apos;ll show up here.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentBookings;