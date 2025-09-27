import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface ModalProps {
  showModal: boolean;
  toggleModal: () => void;
  type?: string;
}

const BookingConfirmation = ({ showModal, toggleModal, type }: ModalProps) => {
  const router = useRouter();

  const closeModal = () => {
    toggleModal();
    const redirectPath =
      type === "movies_and_cinema"
        ? "/movies"
        : type === "events"
        ? "/events"
        : type === "accommodations"
        ? "/accommodations"
        : type === "leisure"
        ? "/leisure"
        : "/";
    router.push(redirectPath);
  };

  return (
    <Dialog open={showModal} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DotLottieReact
            src="/assets/Success.lottie"
            // loop
            autoplay
            className="size-12 mx-auto"
          />

          <DialogTitle className="text-center text-primary text-lg mt-2">
            Booking Confirmed
          </DialogTitle>
          <DialogDescription className="text-gray-700 text-center text-xs/relaxed">
            Thank you for choosing harmonybookme.com! <br /> Your booking is
            confirmed, click the button below to view your booking.
          </DialogDescription>
          <div className="flex items-center justify-center mt-4">
            <Link
              href={`/bookings`}
              className="bg-primary text-white text-xs font-medium rounded-md px-4 py-2.5 hover:bg-primary/90 transition ease-in-out duration-300 cursor-pointer"
            >
              View Booking
            </Link>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmation;