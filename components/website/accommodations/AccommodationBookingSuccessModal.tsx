import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";

interface AccommodationBookingSuccessModalProps {
  showModal: boolean;
  toggleModal: () => void;
}

const AccommodationBookingSuccessModal = ({
  showModal,
  toggleModal,
}: AccommodationBookingSuccessModalProps) => {
  return (
    <Dialog open={showModal} onOpenChange={toggleModal}>
      <DialogContent>
        <DialogHeader>
          <DotLottieReact
            src="/assets/Success.lottie"
            // loop
            autoplay
            className="size-12 mx-auto"
          />

          <DialogTitle className="text-center text-primary text-lg mt-2">
            Booking Request Submitted
          </DialogTitle>
          <DialogDescription className="text-gray-700 text-center text-xs/relaxed">
            Your accommodation request has been submitted successfully. <br />
            The vendor will review and notify you of the approval status.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center mt-4">
          <Link
            href={`/bookings`}
            className="bg-primary text-white text-xs font-medium rounded-md px-4 py-2.5 hover:bg-primary/90 transition ease-in-out duration-300 cursor-pointer"
          >
            View Booking
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccommodationBookingSuccessModal;