import React, { forwardRef } from "react";
import Image from "next/image";
import { ExplorerBooking } from "@/types/booking";
import { QRCodeCanvas } from "qrcode.react";

interface EventTicketTemplateProps {
  booking: ExplorerBooking;
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const EventTicketTemplate = forwardRef<HTMLDivElement, EventTicketTemplateProps>(
  ({ booking }, ref) => {
    const totalAmount = booking?.totalAmount?.toLocaleString() ?? "0";
    
    // Extract explorer details with proper fallbacks
    const explorerName = booking?.explorer?.firstName && booking?.explorer?.lastName
      ? `${booking.explorer.firstName} ${booking.explorer.lastName}`.trim()
      : booking?.explorer?.firstName || booking?.explorer?.lastName || "N/A";
    const username = booking?.explorer?.username 
      ? `@${booking.explorer.username}` 
      : "N/A";
    const email = booking?.explorer?.email || "N/A";

    return (
      <div
        ref={ref}
        className="w-[800px] rounded-2xl border shadow-xl overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          color: "#111827",
          borderColor: "#e5e7eb",
        }}
      >
        {/* Header / Branding */}
        <div
          className="flex justify-between items-center px-10 py-6"
          style={{
            backgroundColor: "#0f172a",
            color: "#ffffff",
          }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.18em]" style={{ opacity: 0.8 }}>
              Harmony Bookme
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              E‑Ticket
            </h1>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-[11px] uppercase tracking-[0.18em] opacity-80">
              Booking Code
            </p>
            <p className="text-sm font-semibold tracking-[0.22em]">
              {booking?.code || "N/A"}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex px-10 py-8 gap-8">
          {/* Left: Event info */}
          <div className="flex-1 space-y-5 text-gray-900">
            {/* Event title + image */}
            <div className="flex gap-4 items-start">
              <div
                className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                style={{ backgroundColor: "#f3f4f6" }}
              >
                <Image
                  src={booking?.listing?.images?.[0] || "/placeholder.jpg"}
                  alt={booking?.listing?.title || "Event"}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div>
                <p
                  className="text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: "#6b7280" }}
                >
                  Event
                </p>
                <h2 className="mt-1 text-lg font-semibold text-gray-900">
                  {booking?.listing?.title || "Event"}
                </h2>
                <p className="mt-1 text-xs text-gray-500 max-w-xs">
                  Please arrive at the venue with a valid ID and this e‑ticket for
                  verification at the entrance.
                </p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p
                  className="font-medium uppercase tracking-[0.16em]"
                  style={{ color: "#6b7280" }}
                >
                  Booker
                </p>
                <p className="text-gray-900 font-semibold">
                  {explorerName}
                </p>
              </div>

              <div className="space-y-1">
                <p
                  className="font-medium uppercase tracking-[0.16em]"
                  style={{ color: "#6b7280" }}
                >
                  Username
                </p>
                <p className="text-gray-900">
                  {username}
                </p>
              </div>

              <div className="space-y-1">
                <p
                  className="font-medium uppercase tracking-[0.16em]"
                  style={{ color: "#6b7280" }}
                >
                  Email
                </p>
                <p className="text-gray-900">
                  {email}
                </p>
              </div>

              <div className="space-y-1">
                <p
                  className="font-medium uppercase tracking-[0.16em]"
                  style={{ color: "#6b7280" }}
                >
                  Booked On
                </p>
                <p className="text-gray-900">
                  {formatDateTime(booking?.createdAt)}
                </p>
              </div>

              <div className="space-y-1">
                <p
                  className="font-medium uppercase tracking-[0.16em]"
                  style={{ color: "#6b7280" }}
                >
                  Status
                </p>
                <p className="text-gray-900 capitalize font-semibold">
                  {booking?.status}
                </p>
              </div>

              <div className="space-y-1">
                <p
                  className="font-medium uppercase tracking-[0.16em]"
                  style={{ color: "#6b7280" }}
                >
                  Payment
                </p>
                <p className="text-gray-900 capitalize">
                  {booking?.paymentStatus || "pending"}
                </p>
              </div>

              <div className="space-y-1">
                <p
                  className="font-medium uppercase tracking-[0.16em]"
                  style={{ color: "#6b7280" }}
                >
                  Amount Paid
                </p>
                <p className="text-gray-900 font-semibold">
                  NGN {totalAmount}
                </p>
              </div>
            </div>
          </div>

          {/* Right: QR & meta */}
          <div
            className="w-64 flex flex-col items-center justify-between border-l border-dashed pl-8"
            style={{ borderColor: "#e5e7eb" }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="rounded-2xl p-3"
                style={{ backgroundColor: "#111827" }}
              >
                <QRCodeCanvas
                  value={booking?.code || "HARMONY-BOOKING"}
                  size={120}
                  bgColor="#111827"
                  fgColor="#F9FAFB"
                  includeMargin={false}
                />
              </div>
              <p
                className="text-[11px] text-center max-w-[160px]"
                style={{ color: "#6b7280" }}
              >
                Scan at the venue or present this code at the entrance to verify
                your booking.
              </p>
            </div>

            <div
              className="w-full mt-6 pt-4 border-t space-y-1.5 text-[10px]"
              style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
            >
              <p>• This ticket is valid for a single entry only.</p>
              <p>• Non‑transferable without vendor&apos;s permission.</p>
              <p>• See event listing on harmonybookme.com for full terms.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

EventTicketTemplate.displayName = "EventTicketTemplate";

export default EventTicketTemplate;


