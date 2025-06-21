import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Logo from "@/public/assets/logo-wordmark-dark.png";
import Image from "next/image";

const ResponsiveSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="text-primary size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9h16.5m-16.5 6.75h16.5"
          />
        </svg>
      </SheetTrigger>
      <SheetContent side="left" className="">
        <SheetHeader>
          <SheetTitle>
            <Link href={"/"} className="text-[#183264] text-base font-semibold">
              <Image src={Logo} className="w-40" alt="HarmonyBookMe" />
            </Link>
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="w-full !h-full flex flex-col justify-between p-4">
          <div className="flex flex-col gap-8">
            <Link href={"/"} className="text-primary text-[13px] font-medium">
              Discover
            </Link>
            <Link href={"/"} className="text-primary text-[13px] font-medium">
              Events
            </Link>
            <Link href={"/"} className="text-primary text-[13px] font-medium">
              Movies
            </Link>
            <Link href={"/"} className="text-primary text-[13px] font-medium">
              Accommodation
            </Link>
            <Link href={"/"} className="text-primary text-[13px] font-medium">
              Leisure
            </Link>
          </div>
          <div className="w-full flex flex-col gap-2">
            <Link
              href={"/"}
              className="!w-full flex items-center justify-center bg-primary text-white text-xs font-semibold rounded-lg py-4"
            >
              Get started
            </Link>
            <Link
              href={"/"}
              className="!w-full flex items-center justify-center bg-white text-primary text-xs font-semibold border border-primary rounded-lg py-4"
            >
              Log In
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ResponsiveSidebar;