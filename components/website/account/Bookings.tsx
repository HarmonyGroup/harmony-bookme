import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useGetExplorerBookings } from "@/services/explorer/booking";
import { useDebounce } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import BookingCardSkeleton from "../bookings/BookingCardSkeleton";
import RecentBookingCard from "../shared/RecentBookingCard";
import { ExplorerBooking } from "@/types/booking";

interface BookingsProps {
  selectedBookingId?: string;
}

const Bookings: React.FC<BookingsProps> = ({ selectedBookingId }) => {
  const [selectedService, setSelectedService] =
    React.useState<string>("events");
  const [searchQuery] = React.useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const { data, isLoading } = useGetExplorerBookings({
    type: selectedService ?? "",
    search: debouncedSearchQuery ?? "",
  });
  const bookings = data?.data?.bookings;

  // Handle selectedBookingId - switch to leisure if it's a leisure booking
  useEffect(() => {
    if (selectedBookingId && bookings) {
      const selectedBooking = bookings.find((booking: ExplorerBooking) => booking._id === selectedBookingId);
      if (selectedBooking && selectedBooking.type === "leisure") {
        setSelectedService("leisure");
      }
    }
  }, [selectedBookingId, bookings]);

  return (
    <div>
      <h3 className="text-primary text-base font-semibold">Bookings</h3>
      {/* <p className="text-gray-500 text-xs mt-1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p> */}
      <div>
        <div className="flex items-center justify-between mt-8">
          <Select
            value={selectedService}
            onValueChange={(value) => setSelectedService(value)}
          >
            <SelectTrigger
              defaultValue={"events"}
              className="min-w-[140px] bg-white text-gray-700 !text-xs font-medium data-[placeholder]:!text-gray-700 placeholder:text-xs placeholder:font-medium shadow-xs outline-none ring-0 focus:shadow-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 cursor-pointer !py-4"
            >
              <SelectValue placeholder="Select booking type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="events"
                className="text-gray-600 text-xs cursor-pointer px-3 py-2"
              >
                Events
              </SelectItem>
              <SelectItem
                value="accommodations"
                className="text-gray-600 text-xs cursor-pointer px-3 py-2"
              >
                Accommodations
              </SelectItem>
              <SelectItem
                value="leisure"
                className="text-gray-600 text-xs cursor-pointer px-3 py-2"
              >
                Leisure
              </SelectItem>
              <SelectItem
                value="movies_and_cinema"
                className="text-gray-600 text-xs cursor-pointer px-3 py-2"
              >
                Movies and cinema
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="relative hidden md:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              stroke="currentColor"
              className="absolute left-4 top-1/2 -translate-y-1/2 size-[12px] text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <Input
              type="search"
              className="w-[300px] bg-white !text-xs placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal shadow-xs outline-none ring-0 focus:shadow-xs px-4 !py-4 ps-9 border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
              placeholder="Search listing or booking code here"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-6">
          {isLoading ? (
            [...Array(7)].map((_, index) => <BookingCardSkeleton key={index} />)
          ) : bookings?.length ? (
            <>
              {bookings?.map((booking, index) => (
                <RecentBookingCard 
                  booking={booking} 
                  key={index} 
                  isSelected={selectedBookingId === booking._id}
                />
              ))}
            </>
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
                Book {selectedService} and they&apos;ll show up here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;