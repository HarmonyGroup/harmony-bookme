import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrashIcon } from "@phosphor-icons/react";

interface FilterBoxProps {
  search: string;
  setSearch: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
}

const FilterBox = ({
  search,
  setSearch,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}: FilterBoxProps) => {
  const handleClear = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
  };
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-primary text-[13px]">Quick search</Label>
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
            className="bg-white !text-xs placeholder:text-xs shadow-none outline-none ring-0 focus:shadow-xs px-4 !py-5 ps-[32px] border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            placeholder="Search leisure activities here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <Label className="text-primary text-[13px]">Price range</Label>
        <div className="w-full flex items-center gap-3">
          <Input
            placeholder="Min price"
            className="bg-white !text-xs placeholder:text-xs shadow-none outline-none ring-0 focus:shadow-xs px-4 !py-5 border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-gray-600 text-base">-</span>
          <Input
            placeholder="Max price"
            className="bg-white !text-xs placeholder:text-xs shadow-none outline-none ring-0 focus:shadow-xs px-4 !py-5 border focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="w-full">
        <Button
          onClick={handleClear}
          className="w-full bg-muted text-primary text-xs font-medium rounded-lg cursor-pointer transition-colors ease-in-out duration-300 !py-5 hover:bg-muted/80"
        >
          <TrashIcon className="text-primary" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterBox;