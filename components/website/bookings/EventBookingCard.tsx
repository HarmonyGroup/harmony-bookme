"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExplorerBooking } from "@/types/booking";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface EventBookingCardProps {
  booking: ExplorerBooking;
  isSelected?: boolean;
}

type EventBookingDetails = {
  tickets?: {
    ticketTypeId: string;
    quantity: number;
  }[];
};

const EventBookingCard: React.FC<EventBookingCardProps> = ({
  booking,
  isSelected = false,
}) => {
  const details = (booking.details || {}) as EventBookingDetails;
  const [isDownloading, setIsDownloading] = useState(false);

  const totalTickets =
    details.tickets?.reduce(
      (sum: number, ticket) => sum + (ticket.quantity || 0),
      0
    ) ?? 0;

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 border border-green-600";
      case "pending":
        return "text-yellow-600 border border-yellow-600";
      case "cancelled":
        return "text-red-600 border border-red-600";
      case "failed":
        return "text-rose-600 border border-rose-600";
      default:
        return "text-gray-600 border border-gray-600";
    }
  };

  const handleDownloadTicket = async () => {
    try {
      setIsDownloading(true);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const marginX = 15;
      let cursorY = 20;

      const code = booking?.code || "N/A";
      const title = booking?.listing?.title || "Event";
      const amount = booking?.totalAmount?.toLocaleString() || "0";
      const status = booking?.status || "pending";
      const paymentStatus = booking?.paymentStatus || "pending";
      const bookedOn = booking?.createdAt
        ? new Date(booking.createdAt).toLocaleString()
        : "N/A";
      
      // Extract explorer details with proper fallbacks
      const explorerName = booking?.explorer?.firstName && booking?.explorer?.lastName
        ? `${booking.explorer.firstName} ${booking.explorer.lastName}`.trim()
        : booking?.explorer?.firstName || booking?.explorer?.lastName || "N/A";
      const username = booking?.explorer?.username
        ? `@${booking.explorer.username}`
        : "N/A";
      const email = booking?.explorer?.email || "N/A";

      // Header
      pdf.setFontSize(18);
      pdf.setTextColor(20, 20, 20);
      pdf.text("Harmony Bookme - Event E-ticket", pageWidth / 2, cursorY, {
        align: "center",
      });

      cursorY += 10;
      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Booking Code: ${code}`, pageWidth / 2, cursorY, {
        align: "center",
      });

      // Divider
      cursorY += 8;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(marginX, cursorY, pageWidth - marginX, cursorY);

      // Event info
      cursorY += 12;
      pdf.setFontSize(14);
      pdf.setTextColor(20, 20, 20);
      pdf.text(title, marginX, cursorY);

      cursorY += 8;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        "Please present this e-ticket along with a valid ID at the event entrance.",
        marginX,
        cursorY
      );

      // Details block
      cursorY += 14;
      pdf.setFontSize(11);
      pdf.setTextColor(30, 30, 30);

      const detailLines: string[] = [
        `Booker: ${explorerName}`,
        `Username: ${username}`,
        `Email: ${email}`,
        `Booked on: ${bookedOn}`,
        `Status: ${status}`,
        `Payment status: ${paymentStatus}`,
        `Amount paid: NGN ${amount}`,
        `Tickets: ${totalTickets}`,
      ];

      detailLines.forEach((line) => {
        pdf.text(line, marginX, cursorY);
        cursorY += 7;
      });

      // Footer / note
      cursorY += 5;
      pdf.setFontSize(9);
      pdf.setTextColor(130, 130, 130);
      pdf.text(
        "This ticket is valid for a single entry. For full terms and conditions, visit harmonybookme.com.",
        marginX,
        cursorY,
        { maxWidth: pageWidth - marginX * 2 }
      );

      pdf.save(`HarmonyBookme-${code || "event-ticket"}.pdf`);

      toast.success("E-ticket downloaded successfully.");
    } catch (error: unknown) {
      console.error("Ticket PDF generation failed:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate ticket. Please try again.";
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className={`w-full rounded-xl p-4 sm:p-6 transition-all duration-200 ${
        isSelected
          ? "bg-primary/5 border-2 border-primary/20 shadow-md"
          : "bg-white border border-gray-200/60"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Event Image */}
        <div className="relative flex-shrink-0 size-14 rounded-lg overflow-hidden">
          <Image
            src={booking?.listing?.images?.[0] || "/placeholder.jpg"}
            alt={booking?.listing?.title || "Event"}
            className="object-cover"
            fill
            sizes="64px"
            loading="lazy"
          />
        </div>

        <div className="flex-1 w-full">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-base font-semibold text-gray-800">
                {booking?.listing?.title || "Event"}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="bg-purple-100 text-purple-800 text-[11px] font-medium rounded-sm px-3 py-1">
                  Event
                </span>
              </div>
            </div>

            {/* Status and selection */}
            <div className="flex items-center gap-2">
              {isSelected && (
                <span className="text-primary text-xs font-medium bg-primary/10 px-2 py-1 rounded-md">
                  Selected
                </span>
              )}
              <div
                className={`capitalize text-xs font-medium rounded-md px-3 py-1.5 ${getStatusColor(
                  booking?.status
                )}`}
              >
                {booking?.status}
              </div>
            </div>
          </div>

          {/* Booking details grid */}
          <div className="mt-4 sm:mt-6">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Booking Date */}
              <div className="space-y-1">
                <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">
                  Booked on
                </p>
                <p className="text-xs font-medium text-gray-800">
                  {formatDateTime(booking?.createdAt)}
                </p>
              </div>

              {/* Tickets */}
              <div className="space-y-1">
                <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">
                  Tickets
                </p>
                <p className="text-xs font-medium text-gray-800">
                  {totalTickets} {totalTickets === 1 ? "ticket" : "tickets"}
                </p>
              </div>

              {/* Booking Code */}
              <div className="space-y-1">
                <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">
                  Code
                </p>
                <p className="text-xs font-medium text-gray-800 uppercase">
                  {booking?.code || "N/A"}
                </p>
              </div>

              {/* Payment status */}
              <div className="space-y-1">
                <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">
                  Payment
                </p>
                <p className="text-xs font-medium text-gray-800 capitalize">
                  {booking?.paymentStatus || "pending"}
                </p>
              </div>

              {/* Total amount */}
              <div className="space-y-1">
                <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wide">
                  Total
                </p>
                <p className="text-[13px] font-medium text-gray-800">
                  NGN {booking?.totalAmount?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center justify-between border-t border-dashed border-gray-300 pt-5">
            {booking?.status === "confirmed" && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleDownloadTicket}
                  disabled={isDownloading}
                  className="bg-white text-primary text-xs border border-primary shadow-none cursor-pointer hover:bg-primary hover:text-white transition-colors ease-in-out duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isDownloading ? "Generating ticket..." : "Download E-ticket"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBookingCard;

