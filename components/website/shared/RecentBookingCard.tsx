import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExplorerBooking } from "@/types/booking";

interface RecentBookingCardProps {
  booking: ExplorerBooking;
  isSelected?: boolean;
}

const RecentBookingCard: React.FC<RecentBookingCardProps> = ({ booking, isSelected = false }) => {
  return (
    <div className={`w-full rounded-xl p-4 sm:p-6 transition-all duration-200 ${
      isSelected 
        ? "bg-primary/5 border-2 border-primary/20 shadow-md" 
        : "bg-white border border-gray-200/60"
    }`}>
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="relative flex-shrink-0 size-14 rounded-lg overflow-hidden">
          <Image
            src={booking?.listing?.images?.[0] || "/placeholder.jpg"}
            alt={booking?.listing?.title || "Booking image"}
            className="object-cover"
            fill
            sizes="64px"
            loading="lazy"
          />
        </div>
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-base font-semibold text-gray-800">
                {booking?.listing?.title || "Untitled Booking"}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="bg-purple-100 text-purple-800 text-[11px] font-medium rounded-sm px-3 py-1">
                  Concert
                </span>
                <span className="bg-orange-100 text-orange-800 text-[11px] font-medium rounded-sm px-3 py-1">
                  Music & Entertainment
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isSelected && (
                <span className="text-primary text-xs font-medium bg-primary/10 px-2 py-1 rounded-md">
                  Selected
                </span>
              )}
              <div className={`text-xs font-medium rounded-md px-3 py-1.5 ${
                booking?.status === "confirmed" 
                  ? "text-green-600 border border-green-600" 
                  : booking?.status === "pending"
                  ? "text-yellow-600 border border-yellow-600"
                  : "text-red-600 border border-red-600"
              }`}>
                {booking?.status}
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-1">
                <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">
                  Date
                </p>
                <p className="text-xs font-medium text-gray-800">
                  August 8, 2025
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">
                  Code
                </p>
                <p className="text-xs font-medium text-gray-800 uppercase">
                  {booking?.code || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">
                  Reference
                </p>
                <p className="text-[13px] font-medium text-gray-800">
                  1234567JS
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">
                  Paid
                </p>
                <p className="text-[13px] font-medium text-gray-800">
                  NGN 25,000
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-dashed border-gray-300 pt-5">
            <Link
              href="/"
              className="flex items-center gap-2 -muted text-primary text-xs font-medium rounded-lg px-4 py-2 border border-primary transition-colors duration-200 hover:bg-primary hover:text-white"
              aria-label="Download E-Ticket"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                stroke="currentColor"
                className="size-[15px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Download
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="border border-primary rounded-md p-1 focus:ring-0 focus:outline-none transition-colors duration-200 cursor-pointer"
                aria-label="More options"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="size-[18px] text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2">
                <DropdownMenuItem className="text-gray-700 text-xs cursor-pointer py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                    />
                  </svg>
                  Additional details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-700 text-xs cursor-pointer py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                  Hide booking
                </DropdownMenuItem>

                <DropdownMenuItem className="text-gray-700 text-xs cursor-pointer py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                  Report an issue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBookingCard;