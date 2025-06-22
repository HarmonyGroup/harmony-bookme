"use client";

import React from "react";
import Link from "next/link";
// import ReportVendor from "@/components/website/shared/ReportVendor";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
import LeftSide from "@/components/website/accommodations/listing/LeftSide";
import RightSide from "@/components/website/accommodations/listing/RightSide";

const Page = () => {
  return (
    <section className="py-0">
      <div>
        {/* <div className="bg-blue-50 !text-white">
          <Breadcrumb className="mx-auto w-full max-w-7xl mb-6 p-4">
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-gray-400">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components" className="text-gray-400">
                  Accommodations
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-primary">
                  Five-bedroom-duplex-in-ikoyi
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div> */}

        <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-16">
          <div>
            <h1 className="text-primary text-base md:text-xl/tight font-semibold mt-1">
              De Aries Apartments
            </h1>
            <div className="flex items-center gap-4 mt-1 sm:mt-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-yellow-500 size-[16px]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  4.8
                </div>
                <Link href={""} className="text-[11px] sm:text-xs text-gray-600">
                  (44 reviews)
                </Link>
              </div>
              <p className="text-gray-600 text-[11px] sm:text-xs">
                20A, Alaba Lawson, Lekki, Lagos
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mt-6">
            <div className="col-span-1 lg:col-span-2">
              <LeftSide />
            </div>
            <div className="col-span-1">
              <RightSide />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;