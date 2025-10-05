import React from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import AccommodationListingCard from "../accommodations/AccommodationListingCard";

const AccommodationListing = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-medium">Accommodations</h1>
        <div className="flex items-center gap-3">
          <Select>
            <SelectTrigger className="w-[150px] text-gray-600 text-xs border-gray-200 shadow-none cursor-pointer py-5 focus-visible:border-primary">
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="first-added"
                className="text-gray-600 text-xs cursor-pointer !py-2.5"
              >
                First added
              </SelectItem>
              <SelectItem
                value="recently-added"
                className="text-gray-600 text-xs cursor-pointer !py-2.5"
              >
                Recently added
              </SelectItem>
            </SelectContent>
          </Select>
          <Link
            href={"/vendor/accommodations/new"}
            className="bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition ease-in-out duration-300 px-4 py-2.5"
          >
            Add New
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* <AccommodationListingCard />
        <AccommodationListingCard />
        <AccommodationListingCard />
        <AccommodationListingCard />
        <AccommodationListingCard />
        <AccommodationListingCard /> */}
      </div>
    </div>
  );
};

export default AccommodationListing;