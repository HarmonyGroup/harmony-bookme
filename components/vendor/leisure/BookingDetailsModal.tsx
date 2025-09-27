"use client";

import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { ExplorerBooking, VendorBookingsResponse } from "@/types/booking";
import { formatPrice } from "@/lib/utils";
import { useHandleBookingRequest } from "@/services/vendor/booking";
import { toast } from "sonner";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?:
    | ExplorerBooking
    | VendorBookingsResponse["data"]["bookings"][0]
    | null;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Booking request handling
  const handleBookingRequest = useHandleBookingRequest();

  const handleApprove = () => {
    if (!booking?._id) return;

    handleBookingRequest.mutate(
      {
        bookingId: booking._id,
        action: "approve",
        message: "Booking approved",
      },
      {
        onSuccess: () => {
          toast.success("Booking approved successfully!");
          onClose();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to approve booking");
        },
      }
    );
  };

  const handleReject = () => {
    if (!booking?._id) return;

    handleBookingRequest.mutate(
      {
        bookingId: booking._id,
        action: "reject",
        message: "Booking rejected",
      },
      {
        onSuccess: () => {
          toast.success("Booking rejected successfully!");
          onClose();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to reject booking");
        },
      }
    );
  };

  useGSAP(() => {
    if (!modalRef.current) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        // Animate overlay
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        // Animate modal content
        gsap.fromTo(
          contentRef.current,
          {
            x: "100%",
            opacity: 0,
          },
          {
            x: "0%",
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          }
        );

        // Stagger animate content elements
        gsap.fromTo(
          contentRef.current?.querySelectorAll(".animate-content") || [],
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      } else {
        // Animate out
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        });

        gsap.to(contentRef.current, {
          x: "100%",
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }, modalRef);

    return () => ctx.revert();
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={cn("fixed inset-0 z-50 flex items-center justify-end")}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 animate-content">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold text-primary">
              {booking?.code}
            </h2>
            <span
              className={cn(
                "text-[11px] capitalize font-medium rounded-md px-2 py-1",
                booking?.status === "pending" &&
                  "text-amber-700 bg-amber-50 border border-amber-400",
                booking?.status === "confirmed" &&
                  "text-emerald-700 bg-emerald-50 border border-emerald-400",
                booking?.status === "cancelled" &&
                  "text-red-700 bg-red-50 border border-red-400",
                booking?.status === "failed" &&
                  "text-rose-700 bg-rose-50 border border-rose-400",
                booking?.status === "requested" &&
                  "text-orange-700 bg-orange-50 border border-orange-400"
              )}
            >
              {booking?.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 cursor-pointer"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 min-h-0">
          {/* Explorer Information */}
          <div className="animate-content">
            <h3 className="text-xs font-semibold text-primary mb-3 flex items-center gap-2">
              {/* <User className="w-4 h-4" /> */}
              Explorer
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {booking?.explorer?.firstName?.[0]}
                    {booking?.explorer?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-0.5">
                  <p className="font-semibold text-gray-900 text-xs">
                    {booking?.explorer?.firstName} {booking?.explorer?.lastName}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    @{booking?.explorer?.username}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="animate-content">
            <h3 className="text-xs font-semibold text-primary mb-3 flex items-center gap-2">
              {/* <MapPin className="w-4 h-4" /> */}
              Listing Details
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="relative size-10 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={
                      booking?.listing?.images?.[0] || "/placeholder-image.jpg"
                    }
                    alt={booking?.listing?.title || "Service"}
                    className="object-cover"
                    fill
                    loading="eager"
                  />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="font-semibold text-gray-900 text-xs">
                    {booking?.listing?.title}
                  </p>
                  <p className="text-[11px] text-gray-500 capitalize">
                    {booking?.type?.replace("_", " ")}
                  </p>
                </div>
                <Link
                  href={`/${booking?.type}/${booking?.listing?.slug}`}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="animate-content">
            <h3 className="text-xs font-semibold text-primary mb-3 flex items-center gap-2">
              {/* <Calendar className="w-4 h-4" /> */}
              Booking Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-[11px] text-gray-500 font-medium">
                    Date and Time
                  </p>
                  <p className="text-xs font-medium text-gray-900">
                    {moment(booking?.createdAt).format("MMM DD, YYYY")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-500 font-medium">Code</p>
                  <p className="text-xs font-medium text-gray-900">
                    {booking?.code}
                  </p>
                </div>
              </div>

              {/* Accommodation specific details */}
              {booking?.type === "accommodations" && booking?.details && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <p className="text-[11px] text-gray-500 font-medium">
                          Check-in
                        </p>
                        <p className="text-xs font-medium text-gray-900">
                          {moment(booking.details.checkInDate).format(
                            "MMM DD, YYYY"
                          )}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[11px] text-gray-500 font-medium">
                          Check-out
                        </p>
                        <p className="text-xs font-medium text-gray-900">
                          {moment(booking.details.checkOutDate).format(
                            "MMM DD, YYYY"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <p className="text-[11px] text-gray-500 font-medium">
                          Guests
                        </p>
                        <p className="text-xs font-medium text-gray-900">
                          {booking.details.guests}{" "}
                          {booking.details.guests === 1 ? "guest" : "guests"}
                        </p>
                      </div>
                      {booking.details.roomType && (
                        <div className="space-y-1.5">
                          <p className="text-[11px] text-gray-500 font-medium">
                            Room Type
                          </p>
                          <p className="text-xs font-medium text-gray-900">
                            Selected Room
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Information */}
          {booking?.status === "confirmed" && (
            <div className="animate-content">
              <h3 className="text-xs font-semibold text-primary mb-3 flex items-center gap-2">
                Payment Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Paystack charge</span>
                  <span className="text-sm font-semibold text-gray-900">
                    NGN{" "}
                    {formatPrice((booking?.payment?.paystackFees || 0) / 100)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Commission</span>
                  <span className="text-sm font-semibold text-gray-900">
                    NGN{" "}
                    {formatPrice((booking?.payment?.platformAmount || 0) / 100)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Revenue</span>
                  <span className="text-sm font-semibold text-gray-900">
                    NGN{" "}
                    {formatPrice((booking?.payment?.vendorAmount || 0) / 100)}
                  </span>
                </div>
                {booking?.coupon?.applied && (
                  <div className="flex items-center justify-between text-green-600">
                    <span className="text-sm">
                      Coupon Discount ({booking.coupon.code})
                    </span>
                    <span className="text-sm font-semibold">
                      -NGN {formatPrice(booking.coupon.discount)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-900">
                    Total Paid
                  </span>
                  <span className="text-sm font-bold text-primary">
                    NGN {formatPrice((booking?.payment?.amount || 0))}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          {booking?.status === "confirmed" && (
            <div className="animate-content">
              <h3 className="text-xs font-semibold text-primary mb-3 flex items-center gap-2">
                {/* <Info className="w-4 h-4" /> */}
                Additional Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment ID</p>
                  <p className="text-xs font-medium text-gray-700">
                    {booking?.payment?._id || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Reference</p>
                  <p className="text-xs font-medium text-gray-700">
                    {booking?.payment?.paystackReference ||
                      booking?.paymentReference ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Vendor Approval Status */}
          {booking?.vendorApproval && (
            <div className="animate-content">
              <h3 className="text-xs font-semibold text-primary mb-3 flex items-center gap-2">
                Vendor Decision
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Status</span>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-md",
                      booking.vendorApproval.status === "approved" &&
                        "text-green-700 bg-green-50 border border-green-200",
                      booking.vendorApproval.status === "rejected" &&
                        "text-red-700 bg-red-50 border border-red-200",
                      booking.vendorApproval.status === "pending" &&
                        "text-orange-700 bg-orange-50 border border-orange-200"
                    )}
                  >
                    {booking.vendorApproval.status}
                  </span>
                </div>
                {booking.vendorApproval.message && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Message</p>
                    <p className="text-xs font-medium text-gray-900">
                      {booking.vendorApproval.message}
                    </p>
                  </div>
                )}
                {booking.vendorApproval.approvedAt && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Approved At</p>
                    <p className="text-xs font-medium text-gray-900">
                      {moment(booking.vendorApproval.approvedAt).format(
                        "MMM DD, YYYY h:mm A"
                      )}
                    </p>
                  </div>
                )}
                {booking.vendorApproval.rejectedAt && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Rejected At</p>
                    <p className="text-xs font-medium text-gray-900">
                      {moment(booking.vendorApproval.rejectedAt).format(
                        "MMM DD, YYYY h:mm A"
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {booking?.status === "requested" && (
            <div className="animate-content">
              <div className="grid grid-cols-2 items-center gap-3 w-full">
                <Button
                  onClick={handleApprove}
                  disabled={handleBookingRequest.isPending}
                  className="text-xs hover:no-underline cursor-pointer bg-white border border-green-600 text-green-600 !py-5 hover:bg-green-50/50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {handleBookingRequest.isPending ? (
                    <>Accepting...</>
                  ) : (
                    "Accept Booking"
                  )}
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={handleBookingRequest.isPending}
                  className="text-xs hover:no-underline cursor-pointer bg-white border border-red-600 text-red-600 !py-5 hover:bg-red-50/50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {handleBookingRequest.isPending ? (
                    <>Rejecting...</>
                  ) : (
                    "Reject Booking"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;