"use client"

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Page = () => {
  const [status, setStatus] = useState("active");

  return (
    <>
      <section className="p-6 h-full flex flex-col">
        <div>
          <h1 className="text-primary text-xl font-semibold">Bookings</h1>
          <p className="text-gray-500 text-xs mt-1.5">
            Track and manage bookings here
          </p>
        </div>

        <div className="h-full bg-white mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative hidden md:block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="absolute left-4 top-1/2 -translate-y-1/2 size-[13px] text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <Input
                  type="search"
                  className="w-[300px] bg-white !text-xs placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal shadow-xs outline-none ring-0 focus:shadow-xs px-4 !py-5 ps-9 border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                  placeholder="Search booking code here"
                  // value={searchQuery}
                  // onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger className="w-[125px] text-gray-700 text-xs font-medium data-[placeholder]:!font-medium data-[placeholder]:text-gray-700 cursor-pointer !py-5">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="all"
                    className="text-gray-500 text-xs font-medium cursor-pointer"
                  >
                    All
                  </SelectItem>
                  <SelectItem
                    value="unread"
                    className="text-gray-500 text-xs font-medium cursor-pointer"
                  >
                    Active
                  </SelectItem>
                  <SelectItem
                    value="read"
                    className="text-gray-500 text-xs font-medium cursor-pointer"
                  >
                    Disabled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;