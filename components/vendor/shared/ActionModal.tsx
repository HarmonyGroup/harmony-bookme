"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Loader2 } from "lucide-react";

interface ActionModalProps {
  variant: "confirmation" | "delete";
  showModal: boolean;
  toggleModal: () => void;
  loading: boolean;
  onConfirm: () => void;
  heading: string;
  description: string;
}

export const ActionModal = ({
  variant,
  showModal,
  toggleModal,
  loading,
  onConfirm,
  heading,
  description,
}: ActionModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={showModal} onOpenChange={toggleModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="size-10 bg-primary/10 flex items-center justify-center rounded-lg mb-2">
              {variant === "delete" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-[21px] text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-[21px] text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
              )}
            </div>
            <DialogTitle className="text-primary text-base">
              {heading}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-xs/relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button
              onClick={toggleModal}
              className="text-gray-600 text-xs hover:no-underline cursor-pointer"
              variant={"link"}
            >
              Cancel
            </Button>
            <Button
              className="text-xs cursor-pointer transition duration-300 min-w-[81px] h-fit"
              variant={"destructive"}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <span>
                  <Loader2 className="animate-spin" />
                </span>
              ) : (
                <span>Confirm</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={showModal} onOpenChange={toggleModal}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{heading}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};