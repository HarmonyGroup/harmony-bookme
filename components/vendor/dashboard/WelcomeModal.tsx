import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  //   DialogTrigger,
} from "@/components/ui/dialog";
import BG from "@/public/assets/welcome-modal-image.jpg";
import Image from "next/image";
import Link from "next/link";
import { DialogClose } from "@/components/ui/dialog";
interface WelcomeModalProps {
  showModal: boolean;
  toggleModal: () => void;
}

const WelcomeModal = ({ showModal, toggleModal }: WelcomeModalProps) => {
  return (
    <Dialog open={showModal} onOpenChange={toggleModal}>
      <DialogContent
        showCloseButton={false}
        className="border-none shadow-none ring-0 p-0 overflow-hidden outline-none"
      >
        <DialogClose className="absolute top-4 right-4 z-[9999] bg-white/40 border border-white/40 rounded-full p-0.5 cursor-pointer outline-none ring-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-[17px] text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </DialogClose>

        <div className="w-full h-64 relative overflow-hidden">
          <Image src={BG} alt="Harmony Bookme" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-primary/75"></div>
        </div>
        <div className="px-8 py-14 pt-4">
          <DialogHeader>
            <DialogTitle className="text-primary text-base text-center">
              Welcome 🎉
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-xs/relaxed text-center mt-2">
              Thank you for joining HARMONYBOOKME.COM. We are excited to have
              you on board. Complete your profile to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex items-center justify-center mt-6 gap-2">
            <Link
              href={"/vendor/settings"}
              onClick={toggleModal}
              className="bg-primary text-white text-xs font-medium cursor-pointer px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors duration-300"
            >
              Setup Profile
            </Link>
            {/* <Button variant="default" onClick={toggleModal} className="text-xs cursor-pointer transition duration-300">
              Skip, I'll do it later
            </Button> */}
          </div>

          {/* <div className="flex items-center justify-end gap-2 mt-4">
            <Button variant="outline" onClick={toggleModal}>
                Close
            </Button>
            </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
