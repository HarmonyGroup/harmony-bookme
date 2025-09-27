/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TrashIcon } from "@phosphor-icons/react";
// import { buildingTypes } from "@/constants/building-types";

interface FilterBoxProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  bathrooms: string;
  setBathrooms: (value: string) => void;
  buildingType: string;
  setBuildingType: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
}

const FilterBox = ({
  search,
  setSearch,
  status,
  setStatus,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  buildingType,
  setBuildingType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}: FilterBoxProps) => {
  const handleClear = () => {
    setSearch("");
    setStatus("");
    setBedrooms("");
    setBathrooms("");
    setBuildingType("");
    setMinPrice("");
    setMaxPrice("");
  };

  const bedroomOptions = ["All", "1", "2", "3", "4", "5", "6+"];
  const bathroomOptions = ["All", "1", "2", "3", "4", "5", "6+"];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-primary text-xs">Quick search</Label>
        <div className="relative w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.4"
            stroke="currentColor"
            className="absolute left-[14px] top-1/2 -translate-y-1/2 size-[12px] text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <Input
            type="search"
            className="bg-white !text-xs placeholder:text-[11px] shadow-xs outline-none ring-0 focus:shadow-xs px-4 !py-5 ps-[32px] border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            placeholder="Search accommodation here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-3">
        <Label className="text-primary text-xs">Price range</Label>
        <div className="w-full flex items-center gap-3">
          <Input
            placeholder="NGN"
            className="placeholder:text-[11px] !py-5"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-gray-600 text-base">-</span>
          <Input
            placeholder="NGN"
            className="placeholder:text-[11px] !py-5"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-3">
        <Label className="text-primary text-xs">Bedrooms</Label>
        <div className="w-full flex items-center gap-2 mt-2.5">
          {bedroomOptions.map((option) => (
            <button
              key={option}
              onClick={() => setBedrooms(option === "All" ? "" : option)}
              className={`w-[45px] text-xs font-medium rounded-md p-2 cursor-pointer transition-colors ease-in-out duration-300 ${
                bedrooms === (option === "All" ? "" : option)
                  ? "bg-primary text-white"
                  : "bg-muted text-primary hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Label className="text-primary text-xs">Bathrooms</Label>
        <div className="w-full flex items-center gap-2 mt-2.5">
          {bathroomOptions.map((option) => (
            <button
              key={option}
              onClick={() => setBathrooms(option === "All" ? "" : option)}
              className={`w-[45px] text-xs font-medium rounded-md p-2 cursor-pointer transition-colors ease-in-out duration-300 ${
                bathrooms === (option === "All" ? "" : option)
                  ? "bg-primary text-white"
                  : "bg-muted text-primary hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Label className="text-primary text-xs">Accommodation Type</Label>
        <div className="flex flex-col gap-5">
          {/* {buildingTypes?.map((type, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                checked={buildingType === type.value}
                onCheckedChange={() =>
                  setBuildingType(buildingType === type.value ? "" : type.value)
                }
              />
              <Label className="text-gray-700 text-xs font-normal">
                {type?.label}
              </Label>
            </div>
          ))} */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={buildingType === "all"}
              onCheckedChange={() =>
                setBuildingType(buildingType === "all" ? "" : "all")
              }
            />
            <Label className="text-gray-700 text-xs font-normal">All</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={buildingType === "shortlet"}
              onCheckedChange={() =>
                setBuildingType(buildingType === "shortlet" ? "" : "shortlet")
              }
            />
            <Label className="text-gray-700 text-xs font-normal">
              Shortlets
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={buildingType === "hotel"}
              onCheckedChange={() =>
                setBuildingType(buildingType === "hotel" ? "" : "hotel")
              }
            />
            <Label className="text-gray-700 text-xs font-normal">Hotels</Label>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Button
          onClick={handleClear}
          className="w-full bg-muted text-primary text-xs font-medium rounded-lg cursor-pointer transition-colors ease-in-out duration-300 !py-5 hover:bg-muted/80"
        >
          <TrashIcon className="text-primary" />
          Clear Filters
        </Button>
      </div>
      {/* <div className="w-full grid grid-cols-2 items-center gap-2.5">
        <Button
          onClick={handleClear}
          className="w-full bg-muted text-primary text-xs font-medium rounded-lg hover:bg-primary/10 cursor-pointer transition-colors ease-in-out duration-300 !py-5"
        >
          Clear
        </Button>
        <Button className="w-full bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 cursor-pointer transition-colors ease-in-out duration-300 !py-5">
          Apply
        </Button>
      </div> */}
    </div>
  );
};

export default FilterBox;