import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface PreviewProps {
  showModal: boolean;
  toggleModal: () => void;
}

const EventBookingPreview = ({ showModal, toggleModal }: PreviewProps) => {
  return (
    <>
      <Sheet open={showModal} onOpenChange={toggleModal}>
        <SheetContent side="left">
          <SheetHeader className="border-b">
            <SheetTitle className="text-primary">Booking Summary</SheetTitle>
            {/* <SheetDescription></SheetDescription> */}
          </SheetHeader>
          <div className="space-y-6 px-4">
            <div className="space-y-1.5">
              <p className="text-gray-500 text-xs">Date</p>
              <span className="w-full bg-muted text-[13px] font-medium">
                July 9 03:45 AM
              </span>
            </div>
            <div className="space-y-1.5">
              <p className="text-gray-500 text-xs">Booking ID</p>
              <p className="text-[13px] font-medium">#ROXV4</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-gray-500 text-xs">Reference Number</p>
              <p className="text-[13px] font-medium">#ROXV4</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EventBookingPreview;