"use client";

import dynamic from "next/dynamic";
import BookingCardSkeleton from "@/components/website/bookings/BookingCardSkeleton";

// Export as dynamic component to avoid SSR issues with use-debounce
const MyBookings = dynamic(
  () => import("@/components/website/bookings/MyBookingsContent"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[90vh] bg-muted/60">
        <div className="mx-auto w-full max-w-7xl px-5 py-10 md:py-10">
          <div className="grid grid-cols-1 gap-4 mt-6">
            {[...Array(7)].map((_, index) => (
              <BookingCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

export default MyBookings;