import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { movieGenres } from "@/constants/movie-genres";
import React, { useState } from "react";

interface FilterBoxProps {
  search: string;
  setSearch: (value: string) => void;
  setGenres: (genres: string[]) => void;
  setDuration: (duration: string) => void;
}

const durationOptions = [
  { label: "Under 1 hour", value: "under1" },
  { label: "1 to 2 hours", value: "1to2" },
  { label: "Above 2 hours", value: "above2" },
];

const FilterBox = ({
  search,
  setSearch,
  setGenres,
  setDuration,
}: FilterBoxProps) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>("");

  const handleGenreChange = (genre: string, checked: boolean) => {
    const updatedGenres = checked
      ? [...selectedGenres, genre]
      : selectedGenres.filter((g) => g !== genre);
    setSelectedGenres(updatedGenres);
    setGenres(updatedGenres);
  };

  const handleDurationChange = (value: string) => {
    const newDuration = selectedDuration === value ? "" : value;
    setSelectedDuration(newDuration);
    setDuration(newDuration);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedDuration("");
    setSearch("");
    setGenres([]);
    setDuration("");
  };

  const isClearDisabled =
    !search && selectedGenres.length === 0 && !selectedDuration;

  return (
    <div className="bg-white border border-gray-100 shadow-xs rounded-lg space-y-6 p-5">
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
            placeholder="Search movie here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-primary text-xs">Movie Duration</Label>
        <div className="flex items-center gap-2">
          {durationOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full text-[11px] whitespace-nowrap rounded-md px-3 py-2.5 transition-colors ease-in-out duration-300 cursor-pointer ${
                selectedDuration === option.value
                  ? "bg-primary text-white"
                  : "bg-muted text-gray-500 hover:bg-primary/10 hover:text-gray-700"
              }`}
              onClick={() => handleDurationChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <Label className="text-primary text-xs">Movie Genre</Label>
        <div className="grid grid-cols-2 gap-5">
          {movieGenres?.map((genre) => (
            <div key={genre} className="flex items-center gap-2">
              <Checkbox
                checked={selectedGenres.includes(genre)}
                onCheckedChange={(checked) =>
                  handleGenreChange(genre, !!checked)
                }
                className="cursor-pointer"
              />
              <Label className="text-gray-600 text-xs font-normal">
                {genre}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        className="w-full text-xs cursor-pointer disabled:cursor-not-allowed"
        onClick={clearFilters}
        disabled={isClearDisabled}
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default FilterBox;