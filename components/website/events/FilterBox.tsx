/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { EVENT_CATEGORIES } from "@/constants/events";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
interface FilterBoxProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  pricingType: string;
  setPricingType: React.Dispatch<React.SetStateAction<string>>;
  eventFormat: string;
  setEventFormat: React.Dispatch<React.SetStateAction<string>>;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

const FilterBox: React.FC<FilterBoxProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  pricingType,
  setPricingType,
  eventFormat,
  setEventFormat,
  date,
  setDate,
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const CATEGORIES_TO_SHOW = 5;

  const handleClear = () => {
    setSearch("");
    setCategory("");
    setPricingType("");
    setEventFormat("");
    setDate(undefined);
  };

  const handleCategoryToggle = (categoryName: string) => {
    setCategory(category === categoryName ? "" : categoryName);
  };

  const toggleShowAllCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const displayedCategories = showAllCategories
    ? EVENT_CATEGORIES
    : EVENT_CATEGORIES.slice(0, CATEGORIES_TO_SHOW);

  return (
    // <div className="">
    //   <div className="space-y-6">
    //     <div>
    //       <h3 className="text-primary text-xs font-semibold">Search Events</h3>
    //       <div className="mt-4">
    //         <Input
    //           type="text"
    //           placeholder="Search by event title"
    //           value={search}
    //           onChange={(e) => setSearch(e.target.value)}
    //           className="!py-5 !text-xs font-normal placeholder:text-gray-600 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all ease-in-out duration-300"
    //         />
    //       </div>
    //     </div>
    //     <Separator className="my-4" />
    //     <div>
    //       <h3 className="text-primary text-xs font-semibold">Event Category</h3>
    //       <div className="mt-4">
    //         <Select
    //           value={category || "all"}
    //           onValueChange={(value) =>
    //             setCategory(value === "all" ? "" : value)
    //           }
    //         >
    //           <SelectTrigger className="w-full text-xs font-medium shadow-none cursor-pointer !py-5">
    //             <SelectValue placeholder="Select event category" />
    //           </SelectTrigger>
    //           <SelectContent>
    //             <SelectItem
    //               value="all"
    //               className="text-gray-600 text-xs cursor-pointer px-2 py-2.5"
    //             >
    //               All Categories
    //             </SelectItem>
    //             {EVENT_CATEGORIES?.map((cat, index) => (
    //               <SelectItem
    //                 key={index}
    //                 value={cat}
    //                 className="text-gray-600 text-xs cursor-pointer px-2 py-2.5"
    //               >
    //                 {cat}
    //               </SelectItem>
    //             ))}
    //           </SelectContent>
    //         </Select>
    //       </div>
    //     </div>
    //     <Separator className="my-4" />
    //     <div>
    //       <h3 className="text-primary text-xs font-semibold">Event Pricing</h3>
    //       <div className="space-y-4 mt-4">
    //         <div className="flex items-center gap-2">
    //           <Checkbox
    //             id="free"
    //             checked={pricingType === "free"}
    //             onCheckedChange={(checked) =>
    //               setPricingType(checked ? "free" : "")
    //             }
    //           />
    //           <Label
    //             htmlFor="free"
    //             className="text-gray-600 text-xs font-medium"
    //           >
    //             Free
    //           </Label>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <Checkbox
    //             id="paid"
    //             checked={pricingType === "paid"}
    //             onCheckedChange={(checked) =>
    //               setPricingType(checked ? "paid" : "")
    //             }
    //           />
    //           <Label
    //             htmlFor="paid"
    //             className="text-gray-600 text-xs font-medium"
    //           >
    //             Paid
    //           </Label>
    //         </div>
    //       </div>
    //     </div>
    //     <Separator className="my-4" />
    //     <div>
    //       <h3 className="text-primary text-xs font-semibold">Event Format</h3>
    //       <div className="space-y-4 mt-4">
    //         <div className="flex items-center gap-2">
    //           <Checkbox
    //             id="in-person"
    //             checked={eventFormat === "in-person"}
    //             onCheckedChange={(checked) =>
    //               setEventFormat(checked ? "in-person" : "")
    //             }
    //           />
    //           <Label
    //             htmlFor="in-person"
    //             className="text-gray-600 text-xs font-medium"
    //           >
    //             In-Person
    //           </Label>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <Checkbox
    //             id="virtual"
    //             checked={eventFormat === "virtual"}
    //             onCheckedChange={(checked) =>
    //               setEventFormat(checked ? "virtual" : "")
    //             }
    //           />
    //           <Label
    //             htmlFor="virtual"
    //             className="text-gray-600 text-xs font-medium"
    //           >
    //             Virtual
    //           </Label>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <Checkbox
    //             id="hybrid"
    //             checked={eventFormat === "hybrid"}
    //             onCheckedChange={(checked) =>
    //               setEventFormat(checked ? "hybrid" : "")
    //             }
    //           />
    //           <Label
    //             htmlFor="hybrid"
    //             className="text-gray-600 text-xs font-medium"
    //           >
    //             Hybrid
    //           </Label>
    //         </div>
    //       </div>
    //     </div>
    //     <Separator className="my-4" />
    //     <div>
    //       <h3 className="text-primary text-xs font-semibold">Event Date</h3>
    //       <div className="mt-4">
    //         <Calendar
    //           mode="single"
    //           selected={date}
    //           onSelect={setDate}
    //           className="text-xs w-full !p-0"
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </div>
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
            placeholder="Search events here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <Label className="text-primary text-[13px]">Event Category</Label>
        <div className="flex flex-col gap-3">
          {displayedCategories.map((categoryName) => (
            <div key={categoryName} className="flex items-center gap-2">
              <Checkbox
                id={categoryName}
                checked={category === categoryName}
                onCheckedChange={() => handleCategoryToggle(categoryName)}
              />
              <Label
                htmlFor={categoryName}
                className="text-gray-600 text-[13px] font-normal"
              >
                {categoryName}
              </Label>
            </div>
          ))}
          {EVENT_CATEGORIES.length > CATEGORIES_TO_SHOW && (
            <Button
              variant="ghost"
              onClick={toggleShowAllCategories}
              className="text-primary text-[12px] font-medium p-0 h-auto hover:bg-transparent hover:text-primary/80 self-start cursor-pointer"
            >
              {showAllCategories
                ? "Show Less"
                : `Show More (${
                    EVENT_CATEGORIES.length - CATEGORIES_TO_SHOW
                  } more)`}
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <Label className="text-primary text-[13px]">Event Pricing</Label>
        <div className="flex items-center gap-2">
          <Checkbox
            id="free"
            checked={pricingType === "free"}
            onCheckedChange={(checked) => setPricingType(checked ? "free" : "")}
          />
          <Label
            htmlFor="free"
            className="text-gray-500 text-[13px] font-normal"
          >
            Free
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="paid"
            checked={pricingType === "paid"}
            onCheckedChange={(checked) => setPricingType(checked ? "paid" : "")}
          />
          <Label
            htmlFor="paid"
            className="text-gray-500 text-[13px] font-normal"
          >
            Paid
          </Label>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-3">
        <Label className="text-primary text-xs">Event Format</Label>
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-person"
            checked={eventFormat === "in-person"}
            onCheckedChange={(checked) =>
              setEventFormat(checked ? "in-person" : "")
            }
          />
          <Label
            htmlFor="in-person"
            className="text-gray-600 text-[13px] font-normal"
          >
            In-Person
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="virtual"
            checked={eventFormat === "virtual"}
            onCheckedChange={(checked) =>
              setEventFormat(checked ? "virtual" : "")
            }
          />
          <Label
            htmlFor="virtual"
            className="text-gray-600 text-[13px] font-normal"
          >
            Virtual
          </Label>
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