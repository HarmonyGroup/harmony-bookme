"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z, ZodIssue } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUploadImage } from "@/services/shared/image-upload";
import {
  useGetVendorCinemas,
  useCreateMovie,
  useUpdateMovie,
} from "@/services/vendor/movies-and-cinema";
import { useDebounce } from "use-debounce";
import { ImageIcon } from "@phosphor-icons/react";
import { movieGenres } from "@/constants/movie-genres";
import { Movie } from "@/types/vendor/movies-and-cinema";
import { usePreventZoomAggressive } from "@/hooks/use-prevent-zoom-aggressive";

// Define Movie type based on expected API response
// interface Movie {
//   _id?: string;
//   title: string;
//   description: string;
//   genre: string[];
//   duration?: number;
//   releaseDate: string;
//   rating: "G" | "PG" | "PG-13" | "R" | "NC-17";
//   images: string[];
//   trailerUrl?: string;
//   cinema: string;
//   showtimes: {
//     date: string;
//     startTime: string;
//     auditorium: string;
//     tickets: {
//       name: string;
//       basePrice?: number;
//       capacity: number;
//       hasDiscount?: boolean;
//       discountType?: "percentage" | "fixed";
//       discountValue?: number;
//     }[];
//   }[];
//   language?: string;
//   subtitles?: string;
// }

// Zod schemas
const ShowtimeSchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  auditorium: z.string().min(1, "Auditorium is required"),
  tickets: z
    .array(
      z
        .object({
          name: z.string().min(1, "Ticket name is required"),
          basePrice: z.number().positive("Base price is required"),
          capacity: z
            .number()
            .positive("Capacity is required")
            .min(1, "Capacity is required"),
          hasDiscount: z.boolean().optional(),
          discountType: z.enum(["percentage", "fixed"]).optional(),
          discountValue: z
            .number()
            .positive("Discount value is required")
            .optional(),
        })
        .refine(
          (data) =>
            !data.hasDiscount ||
            (data.discountType !== undefined &&
              data.discountValue !== undefined),
          {
            message:
              "Discount type and value are required when discount is enabled",
            path: ["discountType"],
          }
        )
    )
    .min(1, "At least one ticket is required"),
});

const FormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Movie title must be at least 2 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description cannot exceed 500 characters" }),
  genre: z
    .array(z.string())
    .min(1, { message: "At least one genre is required" }),
  duration: z
    .number()
    .min(30, { message: "Duration must be at least 30 minutes" })
    .max(300, { message: "Duration cannot exceed 300 minutes" }),
  releaseDate: z.string().min(1, { message: "Release date is required" }),
  rating: z.enum(["G", "PG", "PG-13", "R", "NC-17"], {
    message: "Rating is required",
  }),
  images: z
    .array(
      z
        .string()
        .url({ message: "Each image must be a valid URL" })
        .nonempty({ message: "Image URL cannot be empty" })
    )
    .min(1, { message: "At least one image is required" }),
  trailerUrl: z
    .string()
    .url({ message: "Trailer URL must be a valid URL" })
    .optional()
    .or(z.literal("")),
  cinema: z.string().min(1, { message: "Cinema is required" }),
  showtimes: z
    .array(ShowtimeSchema)
    .min(1, { message: "At least one showtime is required" }),
  language: z.string().optional(),
  subtitles: z.string().optional(),
});

// Types for form data
type FormData = z.infer<typeof FormSchema>;
type Errors = Record<string, string>;
type StepKey = 1 | 2 | 3 | 4;


const STEPS = [
  { id: 1, title: "Basic Information", description: "Movie details and trailer" },
  { id: 2, title: "Cinema", description: "Select screening location" },
  {
    id: 3,
    title: "Showtimes & Pricing",
    description: "Schedule showtimes and set prices",
  },
  { id: 4, title: "Media & Additional", description: "Images, language and subtitles" },
];

// Step 1: Basic Movie Information
interface Step1Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors: Errors;
  setErrors: (errors: Errors) => void;
}

const Step1Form: React.FC<Step1Props> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
}) => {

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K] | string
  ) => {
    if (field === "duration" && typeof value === "string") {
      updateFormData({ [field]: value === "" ? 0 : Number(value) } as Partial<FormData>);
    } else {
      updateFormData({ [field]: value } as Partial<FormData>);
    }
    setErrors({ ...errors, [field]: "" });
  };

  const handleGenreChange = (genre: string, checked: boolean) => {
    updateFormData({
      genre: checked
        ? [...formData.genre, genre]
        : formData.genre.filter((g) => g !== genre),
    });
    setErrors({ ...errors, genre: "" });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Movie Title</Label>
        <Input
          placeholder="e.g. The Matrix"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Description</Label>
        <Textarea
          placeholder="Describe the movie (e.g., synopsis, key features)"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="h-full min-h-40 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Genre</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-4">
          {movieGenres?.map((genre) => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={`genre-${genre}`}
                checked={formData.genre.includes(genre)}
                onCheckedChange={(checked) =>
                  handleGenreChange(genre, !!checked)
                }
                className="cursor-pointer"
              />
              <Label
                htmlFor={`genre-${genre}`}
                className="text-xs text-gray-600 cursor-pointer"
              >
                {genre}
              </Label>
            </div>
          ))}
        </div>
        {errors.genre && <p className="text-xs text-red-600">{errors.genre}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Duration (minutes)</Label>
        <Input
          type="number"
          placeholder="e.g. 120"
          value={formData.duration === 0 ? "" : formData.duration}
          onChange={(e) =>
            handleInputChange("duration", e.target.value)
          }
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.duration && (
          <p className="text-xs text-red-600">{errors.duration}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Release Date</Label>
        <Input
          type="date"
          value={formData.releaseDate}
          onChange={(e) => handleInputChange("releaseDate", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.releaseDate && (
          <p className="text-xs text-red-600">{errors.releaseDate}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Rating</Label>
        <Select
          value={formData.rating}
          onValueChange={(value) =>
            handleInputChange(
              "rating",
              value as "G" | "PG" | "PG-13" | "R" | "NC-17"
            )
          }
        >
          <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            {["G", "PG", "PG-13", "R", "NC-17"].map((rating) => (
              <SelectItem
                key={rating}
                value={rating}
                className="text-xs cursor-pointer"
              >
                {rating}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.rating && (
          <p className="text-xs text-red-600">{errors.rating}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Trailer URL (Optional)</Label>
        <Input
          type="url"
          placeholder="Enter a valid url"
          value={formData.trailerUrl || ""}
          onChange={(e) => handleInputChange("trailerUrl", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.trailerUrl && (
          <p className="text-xs text-red-600">{errors.trailerUrl}</p>
        )}
      </div>
    </div>
  );
};

// Step 2: Cinema Selection
interface Step2Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors: Errors;
  setErrors: (errors: Errors) => void;
}

const Step2Form: React.FC<Step2Props> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
}) => {
  const [page] = useState(1);
  const [limit] = useState(20);
  const [search] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const { data: cinemas, isLoading: fetchingCinemas } = useGetVendorCinemas({
    page,
    limit,
    search: debouncedSearch,
  });

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    updateFormData({ [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Cinema</Label>
        <Select
          value={formData.cinema}
          onValueChange={(value) => handleInputChange("cinema", value)}
        >
          <SelectTrigger
            disabled={fetchingCinemas}
            className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer disabled:bg-muted"
          >
            <SelectValue placeholder="Select cinema" />
          </SelectTrigger>
          <SelectContent>
            {cinemas?.data?.map((cinema) => (
              <SelectItem
                key={cinema._id}
                value={String(cinema?._id)}
                className="text-xs cursor-pointer"
              >
                {cinema.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.cinema && (
          <p className="text-xs text-red-600">{errors.cinema}</p>
        )}
      </div>
    </div>
  );
};

// Step 3: Showtimes and Pricing
interface Step3Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors: Errors;
  setErrors: (errors: Errors) => void;
}

const Step3Form: React.FC<Step3Props> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
}) => {
  const { data: cinemas, isLoading: fetchingCinemas } = useGetVendorCinemas({
    page: 1,
    limit: 20,
    search: "",
  });
  const selectedCinema = cinemas?.data?.find((c) => c._id === formData.cinema);
  const auditoriums = selectedCinema?.auditoriums || [];

  const handleShowtimeChange = (
    index: number,
    field: keyof z.infer<typeof ShowtimeSchema>,
    value: string
  ) => {
    const updatedShowtimes = formData.showtimes.map((show, i) =>
      i === index ? { ...show, [field]: value } : show
    );
    updateFormData({ showtimes: updatedShowtimes });
    setErrors({ ...errors, [`showtimes.${index}.${field}`]: "" });
  };

  const handleTicketChange = (
    showtimeIndex: number,
    ticketIndex: number,
    field: keyof z.infer<typeof ShowtimeSchema>["tickets"][0],
    value: string | number | boolean | undefined
  ) => {
    const updatedShowtimes = formData.showtimes.map((show, i) =>
      i === showtimeIndex
        ? {
            ...show,
            tickets: show.tickets.map((ticket, j) =>
              j === ticketIndex
                ? {
                    ...ticket,
                    [field]:
                      field === "basePrice"
                        ? value === ""
                          ? 0
                          : Number(value)
                        : field === "discountValue"
                        ? value === ""
                          ? undefined
                          : Number(value)
                        : field === "capacity"
                        ? value === ""
                          ? 0
                          : Number(value)
                        : field === "discountType"
                        ? value === "percentage" || value === "fixed"
                          ? value as "percentage" | "fixed"
                          : ticket.discountType
                        : value,
                    ...(field === "hasDiscount" && value && !ticket.discountType
                      ? { discountType: "percentage" as const }
                      : {}),
                  }
                : ticket
            ),
          }
        : show
    );
    updateFormData({ showtimes: updatedShowtimes });
    setErrors({
      ...errors,
      [`showtimes.${showtimeIndex}.tickets.${ticketIndex}.${field}`]: "",
    });
  };

  const addShowtime = () => {
    updateFormData({
      showtimes: [
        ...formData.showtimes,
        {
          date: "",
          startTime: "",
          auditorium: "",
          tickets: [
            {
              name: "",
              basePrice: 0,
              capacity: 0,
              hasDiscount: false,
              discountType: "percentage",
            },
          ],
        },
      ],
    });
  };

  const removeShowtime = (index: number) => {
    updateFormData({
      showtimes: formData.showtimes.filter((_, i) => i !== index),
    });
  };

  const addTicket = (showtimeIndex: number) => {
    const updatedShowtimes = formData.showtimes.map((show, i) =>
      i === showtimeIndex
        ? {
            ...show,
            tickets: [
              ...show.tickets,
              {
                name: "",
                basePrice: 0,
                capacity: 0,
                hasDiscount: false,
                discountType: "percentage" as const,
              },
            ],
          }
        : show
    );
    updateFormData({ showtimes: updatedShowtimes });
  };

  const removeTicket = (showtimeIndex: number, ticketIndex: number) => {
    const updatedShowtimes = formData.showtimes.map((show, i) =>
      i === showtimeIndex
        ? {
            ...show,
            tickets: show.tickets.filter((_, j) => j !== ticketIndex),
          }
        : show
    );
    updateFormData({ showtimes: updatedShowtimes });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Showtimes</Label>
        <div className="space-y-4">
          {formData.showtimes.map((showtime, index) => (
            <div key={index} className="border p-4 rounded-md space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Date</Label>
                <Input
                  type="date"
                  value={showtime.date}
                  onChange={(e) =>
                    handleShowtimeChange(index, "date", e.target.value)
                  }
                  className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                />
                {errors[`showtimes.${index}.date`] && (
                  <p className="text-xs text-red-600">
                    {errors[`showtimes.${index}.date`]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Start Time</Label>
                <Input
                  type="time"
                  value={showtime.startTime}
                  onChange={(e) =>
                    handleShowtimeChange(index, "startTime", e.target.value)
                  }
                  className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                />
                {errors[`showtimes.${index}.startTime`] && (
                  <p className="text-xs text-red-600">
                    {errors[`showtimes.${index}.startTime`]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Auditorium</Label>
                <Select
                  value={showtime.auditorium}
                  onValueChange={(value) =>
                    handleShowtimeChange(index, "auditorium", value)
                  }
                  disabled={!formData.cinema || fetchingCinemas}
                >
                  <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer disabled:bg-muted">
                    <SelectValue placeholder="Select auditorium" />
                  </SelectTrigger>
                  <SelectContent>
                    {auditoriums.map((aud) => (
                      <SelectItem
                        key={aud?._id}
                        value={String(aud?._id)}
                        className="text-xs cursor-pointer"
                      >
                        {aud.name} ({aud.screenType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`showtimes.${index}.auditorium`] && (
                  <p className="text-xs text-red-600">
                    {errors[`showtimes.${index}.auditorium`]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Tickets</Label>
                <div className="space-y-4">
                  {showtime.tickets.map((ticket, ticketIndex) => (
                    <div
                      key={ticketIndex}
                      className="border p-4 rounded-md space-y-4"
                    >
                      <div className="space-y-2">
                        <Label className="text-gray-600 text-xs">
                          Ticket Name
                        </Label>
                        <Input
                          placeholder="e.g. General Admission"
                          value={ticket.name}
                          onChange={(e) =>
                            handleTicketChange(
                              index,
                              ticketIndex,
                              "name",
                              e.target.value
                            )
                          }
                          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                        />
                        {errors[
                          `showtimes.${index}.tickets.${ticketIndex}.name`
                        ] && (
                          <p className="text-xs text-red-600">
                            {
                              errors[
                                `showtimes.${index}.tickets.${ticketIndex}.name`
                              ]
                            }
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600 text-xs">
                          Base Price
                        </Label>
                        <Input
                          type="number"
                          placeholder="e.g. 5000"
                          value={ticket.basePrice === 0 ? "" : ticket.basePrice}
                          onChange={(e) =>
                            handleTicketChange(
                              index,
                              ticketIndex,
                              "basePrice",
                              e.target.value
                            )
                          }
                          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                        />
                        {errors[
                          `showtimes.${index}.tickets.${ticketIndex}.basePrice`
                        ] && (
                          <p className="text-xs text-red-600">
                            {
                              errors[
                                `showtimes.${index}.tickets.${ticketIndex}.basePrice`
                              ]
                            }
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600 text-xs">
                          Capacity
                        </Label>
                        <Input
                          type="number"
                          placeholder="e.g. 50"
                          value={ticket.capacity === 0 ? "" : ticket.capacity}
                          onChange={(e) =>
                            handleTicketChange(
                              index,
                              ticketIndex,
                              "capacity",
                              e.target.value
                            )
                          }
                          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                        />
                        {errors[
                          `showtimes.${index}.tickets.${ticketIndex}.capacity`
                        ] && (
                          <p className="text-xs text-red-600">
                            {
                              errors[
                                `showtimes.${index}.tickets.${ticketIndex}.capacity`
                              ]
                            }
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`hasDiscount-${index}-${ticketIndex}`}
                            checked={ticket.hasDiscount}
                            onCheckedChange={(checked) =>
                              handleTicketChange(
                                index,
                                ticketIndex,
                                "hasDiscount",
                                !!checked
                              )
                            }
                            className="cursor-pointer"
                          />
                          <Label
                            htmlFor={`hasDiscount-${index}-${ticketIndex}`}
                            className="text-xs text-gray-600 cursor-pointer"
                          >
                            Apply Discount
                          </Label>
                        </div>
                      </div>
                      {ticket.hasDiscount && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-gray-600 text-xs">
                              Discount Type
                            </Label>
                            <Select
                              value={ticket.discountType}
                              onValueChange={(value) =>
                                handleTicketChange(
                                  index,
                                  ticketIndex,
                                  "discountType",
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  value="percentage"
                                  className="text-xs cursor-pointer"
                                >
                                  Percentage
                                </SelectItem>
                                <SelectItem
                                  value="fixed"
                                  className="text-xs cursor-pointer"
                                >
                                  Fixed Amount
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {errors[
                              `showtimes.${index}.tickets.${ticketIndex}.discountType`
                            ] && (
                              <p className="text-xs text-red-600">
                                {
                                  errors[
                                    `showtimes.${index}.tickets.${ticketIndex}.discountType`
                                  ]
                                }
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-600 text-xs">
                              Discount Value{" "}
                              {ticket.discountType === "percentage"
                                ? "(%)"
                                : "(NGN)"}
                            </Label>
                            <Input
                              type="number"
                              placeholder={
                                ticket.discountType === "percentage"
                                  ? "e.g. 10"
                                  : "e.g. 5000"
                              }
                              value={ticket.discountValue === undefined ? "" : ticket.discountValue}
                              onChange={(e) =>
                                handleTicketChange(
                                  index,
                                  ticketIndex,
                                  "discountValue",
                                  e.target.value
                                )
                              }
                              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            />
                            {errors[
                              `showtimes.${index}.tickets.${ticketIndex}.discountValue`
                            ] && (
                              <p className="text-xs text-red-600">
                                {
                                  errors[
                                    `showtimes.${index}.tickets.${ticketIndex}.discountValue`
                                  ]
                                }
                              </p>
                            )}
                          </div>
                        </>
                      )}
                      {showtime.tickets.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeTicket(index, ticketIndex)}
                          className="bg-red-100/80 text-red-600 text-xs hover:bg-red-100/90 cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="size-[14px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                          Remove Ticket
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addTicket(index)}
                    className="bg-primary/10 text-primary text-xs border-none shadow-none hover:bg-primary/15 hover:text-primary cursor-pointer transition-colors ease-in-out duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.3"
                      stroke="currentColor"
                      className="size-[14px]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Add Ticket
                  </Button>
                </div>
                {errors[`showtimes.${index}.tickets`] && (
                  <p className="text-xs text-red-600">
                    {errors[`showtimes.${index}.tickets`]}
                  </p>
                )}
              </div>
              {formData.showtimes.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeShowtime(index)}
                  className="bg-red-100/80 text-red-600 text-xs hover:bg-red-100/90 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="size-[14px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  Remove Showtime
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addShowtime}
            className="bg-primary/10 text-primary text-xs border-none shadow-none hover:bg-primary/15 hover:text-primary cursor-pointer transition-colors ease-in-out duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.3"
              stroke="currentColor"
              className="size-[14px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Showtime
          </Button>
        </div>
        {errors.showtimes && (
          <p className="text-xs text-red-600">{errors.showtimes}</p>
        )}
      </div>
    </div>
  );
};

// Step 4: Additional Details
interface Step4Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors: Errors;
  setErrors: (errors: Errors) => void;
}

const Step4Form: React.FC<Step4Props> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(formData.images);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const { mutateAsync: uploadImage } = useUploadImage();

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    updateFormData({ [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    const newUploading = fileArray.map((file) => file.name);
    setUploadingFiles((prev) => [...prev, ...newUploading]);

    const toastIds = fileArray.map((file) =>
      toast.loading(`Uploading image: ${file.name}`)
    );

    try {
      const uploadPromises = fileArray.map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadImage(formData);
        toast.dismiss(toastIds[index]);
        toast.success(`Image ${file.name} uploaded successfully`);
        return response.data.url;
      });

      const newUrls = await Promise.all(uploadPromises);
      const updatedUrls = [...imageUrls, ...newUrls];
      updateFormData({ images: updatedUrls });
      setImageUrls(updatedUrls);
    } catch (error: unknown) {
      toastIds.forEach((id) => toast.dismiss(id));
      toast.error(
        `Failed to upload images: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setUploadingFiles((prev) =>
        prev.filter((name) => !newUploading.includes(name))
      );
    }
  };

  const removeImage = (index: number) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    updateFormData({ images: updatedUrls });
    setImageUrls(updatedUrls);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setImageUrls(formData.images);
  }, [formData.images]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Images</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className={`border-2 border-dashed rounded-lg p-4 flex items-center justify-center h-44 relative cursor-pointer ${
              dragActive ? "border-primary bg-primary/10" : "border-gray-200"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <Input
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="text-center">
              <ImageIcon
                size={24}
                className="mx-auto text-center text-gray-500"
              />
              <p className="text-[11px] text-gray-500 mt-2">
                Drag photos here or click to browse
              </p>
              <p className="text-[10px] text-gray-400 mt-1.5">
                JPEG/PNG, max 5MB
              </p>
            </div>
          </div>
          {imageUrls.map((url, index) => (
            <div
              key={url}
              className="relative h-44 border border-gray-100 shadow-xs rounded-lg"
            >
              <Image
                src={url}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {index === 0 && (
                <Badge className="absolute top-2 left-2 text-[11px] cursor-default">
                  Cover photo
                </Badge>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-500/80 transition-colors ease-in-out duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                  stroke="currentColor"
                  className="size-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {uploadingFiles.includes(url.split("/").pop() || "") && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <p className="text-xs text-white">Uploading...</p>
                </div>
              )}
            </div>
          ))}
        </div>
        {errors.images && (
          <p className="text-xs text-red-600">{errors.images}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Language (Optional)</Label>
        <Select
          value={formData.language}
          onValueChange={(value) => handleInputChange("language", value)}
        >
          <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {["English", "Spanish", "French", "Hindi", "Other"].map((lang) => (
              <SelectItem
                key={lang}
                value={lang}
                className="text-xs cursor-pointer"
              >
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.language && (
          <p className="text-xs text-red-600">{errors.language}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Subtitles (Optional)</Label>
        <Select
          value={formData.subtitles}
          onValueChange={(value) => handleInputChange("subtitles", value)}
        >
          <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
            <SelectValue placeholder="Select subtitles" />
          </SelectTrigger>
          <SelectContent>
            {["English", "Spanish", "French", "Hindi", "Other"].map((lang) => (
              <SelectItem
                key={lang}
                value={lang}
                className="text-xs cursor-pointer"
              >
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subtitles && (
          <p className="text-xs text-red-600">{errors.subtitles}</p>
        )}
      </div>
    </div>
  );
};

interface NewMovieFormProps {
  movie?: Movie;
}

const NewMovieForm: React.FC<NewMovieFormProps> = ({ movie }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepKey>(1);
  
  // Prevent zoom on mobile when focusing inputs
  usePreventZoomAggressive();
  
  const [formData, setFormData] = useState<FormData>({
    title: movie?.title || "",
    description: movie?.description || "",
    genre: movie?.genre || [],
    duration: movie?.duration && movie.duration > 0 ? movie.duration : 0,
    releaseDate: movie?.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : "",
    rating: (movie?.rating as "G" | "PG" | "PG-13" | "R" | "NC-17") || "G",
    images: movie?.images || [],
    trailerUrl: movie?.trailerUrl || "",
    cinema: movie?.cinema ? (typeof movie.cinema === 'string' ? movie.cinema : movie.cinema._id || "") : "",
    showtimes: movie?.showtimes?.length ? movie.showtimes.map(show => ({
      date: new Date(show.date).toISOString().split('T')[0],
      startTime: show.startTime,
      auditorium: show.auditorium,
      tickets: show.tickets.map(ticket => ({
        name: ticket.name,
        basePrice: ticket.basePrice || 0,
        capacity: ticket.capacity,
        hasDiscount: ticket.hasDiscount,
        discountType: ticket.discountType,
        discountValue: ticket.discountValue,
      }))
    })) : [
      {
        date: "",
        startTime: "",
        auditorium: "",
        tickets: [
          {
            name: "",
            basePrice: 0,
            capacity: 0,
            hasDiscount: false,
            discountType: "percentage",
          },
        ],
      },
    ],
    language: movie?.language || "",
    subtitles: movie?.subtitles || "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const { mutate: createMovie, isPending: creatingMovie } = useCreateMovie();
  const { isPending: updatingMovie } = useUpdateMovie();

  const isEditMode = !!movie?._id;
  const isPending = creatingMovie || updatingMovie;

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        description: movie.description || "",
        genre: movie.genre || [],
        duration: movie.duration && movie.duration > 0 ? movie.duration : 0,
        releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : "",
        rating: (movie?.rating as "G" | "PG" | "PG-13" | "R" | "NC-17") || "G",
        images: movie.images || [],
        trailerUrl: movie.trailerUrl || "",
        cinema: movie.cinema ? (typeof movie.cinema === 'string' ? movie.cinema : movie.cinema._id || "") : "",
        showtimes: movie.showtimes?.length ? movie.showtimes.map(show => ({
          date: new Date(show.date).toISOString().split('T')[0],
          startTime: show.startTime,
          auditorium: show.auditorium,
          tickets: show.tickets.map(ticket => ({
            name: ticket.name,
            basePrice: ticket.basePrice || 0,
            capacity: ticket.capacity,
            hasDiscount: ticket.hasDiscount,
            discountType: ticket.discountType,
            discountValue: ticket.discountValue,
          }))
        })) : [
          {
            date: "",
            startTime: "",
            auditorium: "",
            tickets: [
              {
                name: "",
                basePrice: 0,
                capacity: 0,
                hasDiscount: false,
                discountType: "percentage" as const,
              },
            ],
          },
        ],
        language: movie.language || "",
        subtitles: movie.subtitles || "",
      });
    }
  }, [movie]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  type StepData = {
    1: Pick<
      FormData,
      | "title"
      | "description"
      | "genre"
      | "duration"
      | "releaseDate"
      | "rating"
      | "trailerUrl"
    >;
    2: Pick<FormData, "cinema">;
    3: Pick<FormData, "showtimes">;
    4: Pick<FormData, "images" | "language" | "subtitles">;
  };

  const validateStep = (step: StepKey): boolean => {
    const stepSchemas: Record<StepKey, z.ZodObject<Record<string, z.ZodTypeAny>>> = {
      1: z.object({
        title: FormSchema.shape.title,
        description: FormSchema.shape.description,
        genre: FormSchema.shape.genre,
        duration: FormSchema.shape.duration,
        releaseDate: FormSchema.shape.releaseDate,
        rating: FormSchema.shape.rating,
        trailerUrl: FormSchema.shape.trailerUrl,
      }),
      2: z.object({
        cinema: FormSchema.shape.cinema,
      }),
      3: z.object({
        showtimes: FormSchema.shape.showtimes,
      }),
      4: z.object({
        images: FormSchema.shape.images,
        language: FormSchema.shape.language,
        subtitles: FormSchema.shape.subtitles,
      }),
    };

    const stepData: StepData = {
      1: {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        duration: formData.duration,
        releaseDate: formData.releaseDate,
        rating: formData.rating,
        trailerUrl: formData.trailerUrl,
      },
      2: {
        cinema: formData.cinema,
      },
      3: {
        showtimes: formData.showtimes,
      },
      4: {
        images: formData.images,
        language: formData.language,
        subtitles: formData.subtitles,
      },
    };

    const result = stepSchemas[step].safeParse(stepData[step]);
    if (!result.success) {
      const newErrors: Errors = {};
      result.error.issues.forEach((issue: ZodIssue) => {
        const path = issue.path.join(".");
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (validateStep(currentStep) && currentStep < STEPS.length) {
      setCurrentStep((prev) => (prev < 4 ? ((prev + 1) as StepKey) : prev));
    } else {
      toast.error("Please fill out all required fields correctly");
    }
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentStep > 1) {
      setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as StepKey) : prev));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      const validationResult = FormSchema.safeParse(formData);
      if (!validationResult.success) {
        const newErrors: Errors = {};
        validationResult.error.issues.forEach((issue: ZodIssue) => {
          newErrors[issue.path.join(".")] = issue.message;
        });
        setErrors(newErrors);
        toast.error("Form data is invalid. Please check all steps.");
        return;
      }

      const payload = {
        ...formData,
        releaseDate: new Date(formData.releaseDate).toISOString(),
        showtimes: formData.showtimes.map((show) => ({
          ...show,
          date: new Date(show.date),
        })),
      };

      try {
        if (isEditMode) {
          // await updateMovie(
          //   { id: movie._id!, data: payload },
          //   {
          //     onSuccess: (response) => {
          //       toast.success(response?.message ?? "Movie updated successfully");
          //       router.push(`/vendor/movies`);
          //     },
          //     onError: (error) => {
          //       toast.error("Failed to update movie: " + error.message);
          //     },
          //   }
          // );
        } else {
          await createMovie(payload, {
            onSuccess: (response) => {
              toast.success(response?.message ?? "Movie created successfully");
              router.push(`/vendor/movies`);
            },
            onError: (error) => {
              toast.error("Failed to create movie: " + error.message);
            },
          });
        }
      } catch {
        toast.error(isEditMode ? "Failed to update movie" : "Failed to create movie");
      }
    } else {
      toast.error("Please fill out all required fields correctly");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Form
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 2:
        return (
          <Step2Form
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 3:
        return (
          <Step3Form
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 4:
        return (
          <Step4Form
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col event-form">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b px-4 lg:px-7 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-primary text-base lg:text-[18px] font-semibold">
              {isEditMode ? "Edit Movie" : "Create Movie"}
            </h1>
            <p className="hidden md:block text-gray-600 text-[11px] md:text-xs mt-0.5 md:mt-1">
              {isEditMode
                ? "Update movie details for your cinema"
                : "List a new movie for your cinema"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout - Fixed Sidebar + Scrollable Content */}
      <div className="flex-1 flex min-h-0">
        {/* Fixed Sidebar - Always visible on desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0 border-r px-6 xl:px-10 py-6 xl:py-8">
          <ol className="relative border-s border-gray-200">
            {STEPS.map((step, index) => (
              <li
                key={step.id}
                className={
                  index < STEPS.length - 1 ? "mb-8 xl:mb-10 ms-6" : "ms-6"
                }
              >
                <span
                  className={`absolute flex items-center justify-center size-6 rounded-full -start-3 ring-8 ring-white ${
                    currentStep === step.id
                      ? "bg-blue-100"
                      : currentStep > step.id
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    className={`size-[11px] ${
                      currentStep === step.id
                        ? "text-primary"
                        : currentStep > step.id
                        ? "text-primary"
                        : "text-gray-400"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </span>
                <h3
                  className={`flex items-center mb-1 text-xs font-semibold ${
                    currentStep === step.id
                      ? "text-primary"
                      : currentStep > step.id
                      ? "text-primary"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="mb-4 text-[11px]/relaxed text-gray-500">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Mobile Step Indicator */}
          <div className="lg:hidden flex-shrink-0 border-b bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-700">
                  Step {currentStep} of {STEPS.length}
                </span>
                <span className="text-xs text-gray-500">
                  {STEPS[currentStep - 1].title}
                </span>
              </div>
              <div className="flex space-x-1">
                {STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index + 1 <= currentStep ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Desktop Step Info */}
              <div className="hidden lg:block">
                <p className="text-gray-500 text-xs">
                  Step {currentStep}/{STEPS.length}
                </p>
                <h3 className="text-primary text-lg font-semibold mt-1.5">
                  {STEPS[currentStep - 1].title}
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  {STEPS[currentStep - 1].description}
                </p>
              </div>

              <div className="mt-6 lg:mt-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderStepContent()}
                </form>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Navigation */}
          <div className="flex-shrink-0 border-t bg-white p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 text-xs cursor-pointer !p-5"
                  disabled={isPending}
                >
                  Previous
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2 text-xs cursor-pointer !p-5"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="text-xs cursor-pointer !p-5"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                  ) : (
                    <span>{isEditMode ? "Update Movie" : "Create Movie"}</span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMovieForm;