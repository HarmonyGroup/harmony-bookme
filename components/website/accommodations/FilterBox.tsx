"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { buildingTypes } from "@/constants/building-types";

const FilterBox = () => {
    
  const [range, setRange] = useState<number[]>([20, 80]);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between bg-white border-b border-gray-200 pb-6 rounded-t-lg">
        <h4 className="text-primary text-sm font-semibold">Filters</h4>
        <Button className="h-fit bg-inherit text-gray-600 text-[11px] gap-1.5 shadow-none cursor-pointer p-0 hover:bg-inherit hover:text-gray-900 !px-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.7"
            stroke="currentColor"
            className="size-[15px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
          Clear all filters (3)
        </Button>
      </div>
      <div className="bg-white rounded-b-lg py-4">
        <h4 className="text-primary text-xs font-semibold">Price Range</h4>
        <Slider
          defaultValue={range}
          value={range}
          onValueChange={setRange}
          min={0}
          max={100}
          step={1}
          className="w-full mt-4"
        />
        <div className="w-full flex items-center gap-2.5 mt-6">
          <div className="w-full space-y-2">
            <Label htmlFor="email" className="text-primary text-xs">
              Minimum
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Minimum price"
              className="placeholder:text-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 !py-5"
            />
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="email" className="text-primary text-xs">
              Maximum
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Maximum price"
              className="placeholder:text-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 !py-5"
            />
          </div>
        </div>
        <h4 className="text-primary text-xs font-semibold mt-4">
          Bed and Bath
        </h4>
        <div className="border rounded-lg p-4 mt-2.5">
          <p className="text-primary text-xs">Bedrooms</p>
          <div className="w-full flex items-center gap-2 mt-2.5">
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              All
            </button>
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              1
            </button>
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              2
            </button>
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              3
            </button>
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              4
            </button>
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              5
            </button>
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              6+
            </button>
          </div>
        </div>
        <div className="border rounded-lg p-4 mt-4">
          <p className="text-primary text-xs">Bathrooms</p>
          <div className="w-full flex items-center gap-2 mt-2.5">
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              All
            </button>
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              1
            </button>
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              2
            </button>
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              3
            </button>
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              4
            </button>
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              5
            </button>
            <button className="w-full text-primary text-xs font-medium border border-primary rounded-md p-2">
              6+
            </button>
          </div>
        </div>
        <h4 className="text-primary text-xs font-semibold mt-4">
          Building Type
        </h4>
        <div className="flex flex-wrap items-center gap-2.5 mt-2.5">
          {buildingTypes?.map((type) => (
            <button
              key={type?.value}
              className="text-gray-600 text-xs border rounded-md py-2 px-4 hover:bg-primary hover:text-white hover:border-primary cursor-pointer transition duration-300 ease-in-out"
            >
              {type?.label}
            </button>
          ))}
        </div>
        <Button className="w-full bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 cursor-pointer mt-6 !py-5">
          Apply Filter
        </Button>
      </div>
    </div>
  );
};

export default FilterBox;