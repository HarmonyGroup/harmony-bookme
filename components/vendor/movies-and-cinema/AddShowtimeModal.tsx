"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { z, ZodIssue } from "zod";
import gsap from "gsap";
import { useGetVendorCinemaById } from "@/services/vendor/movies-and-cinema";
import { format, addMinutes } from "date-fns";

interface ModalProps {
  cinema: string;
  showModal: boolean;
  toggleModal: () => void;
}

const dummyMovies = [
  {
    _id: "movie_123",
    title: "The Galactic Odyssey",
    slug: "the-galactic-odyssey",
    duration: 135,
  },
  {
    _id: "movie_124",
    title: "Mystic Realms",
    slug: "mystic-realms",
    duration: 120,
  },
];

const ShowtimeSchema = z.object({
  movieId: z.string().min(1, "Movie is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  auditorium: z.string().min(1, "Auditorium is required"),
  tickets: z
    .array(
      z
        .object({
          name: z.string().min(1, "Ticket name is required"),
          basePrice: z.number().positive("Price must be positive").optional(),
          capacity: z
            .number()
            .positive("Capacity must be positive")
            .min(1, "Capacity is required"),
          hasDiscount: z.boolean().optional(),
          discountType: z.enum(["percentage", "fixed"]).optional(),
          discountValue: z
            .number()
            .positive("Discount value must be positive")
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

type ShowtimeFormData = z.infer<typeof ShowtimeSchema>;
type Errors = Record<string, string>;

const useGetMoviesByCinema = ({ cinemaId }: { cinemaId: string }) => {
  void cinemaId; // Suppress unused parameter warning
  return { data: { data: dummyMovies }, isLoading: false };
};

const useAddShowtime = () => {
  const [isPending, setIsPending] = useState(false);

  const addShowtime = async (data: ShowtimeFormData) => {
    setIsPending(true);
    const toastId = toast.loading("Adding showtime...");
    try {
      const movie = dummyMovies.find((m) => m._id === data.movieId);
      const startTime = new Date(`${data.date}T${data.startTime}`);
      const endTime = addMinutes(startTime, movie?.duration || 120);

      const response = await fetch("/api/showtimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: data.movieId,
          date: data.date,
          startTime: data.startTime,
          endTime: format(endTime, "HH:mm"),
          auditorium: data.auditorium,
          tickets: data.tickets.map((ticket) => ({
            name: ticket.name,
            basePrice: ticket.basePrice,
            hasDiscount: ticket.hasDiscount,
            discountType: ticket.hasDiscount ? ticket.discountType : undefined,
            discountValue: ticket.hasDiscount ? ticket.discountValue : undefined,
            capacity: ticket.capacity,
            soldCount: 0,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add showtime");
      }
      toast.success("Showtime added successfully", { id: toastId });
      return await response.json();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to add showtime", { id: toastId });
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { addShowtime, isPending };
};

const AddShowtimeModal = ({ cinema, showModal, toggleModal }: ModalProps) => {
  const { data, isLoading } = useGetVendorCinemaById({ id: cinema });
  const { data: moviesData, isLoading: moviesLoading } = useGetMoviesByCinema({ cinemaId: cinema });
  const { addShowtime, isPending } = useAddShowtime();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<ShowtimeFormData>({
    movieId: "",
    date: "",
    startTime: "",
    auditorium: "",
    tickets: [
      {
        name: "",
        basePrice: undefined,
        capacity: 0,
        hasDiscount: false,
        discountType: "percentage",
      },
    ],
  });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (showModal) {
      gsap.to(dialogRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      dialogRef.current?.focus();
    } else {
      gsap.to(dialogRef.current, { scale: 0.95, opacity: 0, duration: 0.3, ease: "power2.in" });
      setFormData({
        movieId: "",
        date: "",
        startTime: "",
        auditorium: "",
        tickets: [
          {
            name: "",
            basePrice: undefined,
            capacity: 0,
            hasDiscount: false,
            discountType: "percentage",
          },
        ],
      });
      setErrors({});
    }
  }, [showModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) toggleModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, toggleModal]);

  const updateFormData = (data: Partial<ShowtimeFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleInputChange = (
    field: keyof ShowtimeFormData,
    value: string | string[]
  ) => {
    updateFormData({ [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleTicketChange = (
    ticketIndex: number,
    field: keyof ShowtimeFormData["tickets"][0],
    value: unknown
  ) => {
    const updatedTickets = formData.tickets.map((ticket, j) =>
      j === ticketIndex
        ? {
            ...ticket,
            [field]:
              field === "basePrice" || field === "discountValue" || field === "capacity"
                ? value === ""
                  ? undefined
                  : Number(value)
                : field === "discountType"
                ? value === "percentage" || value === "fixed"
                  ? (value as "percentage" | "fixed")
                  : ticket.discountType
                : value,
            ...(field === "hasDiscount" && value && !ticket.discountType
              ? { discountType: "percentage" as const }
              : {}),
          }
        : ticket
    );
    updateFormData({ tickets: updatedTickets });
    setErrors({ ...errors, [`tickets.${ticketIndex}.${field}`]: "" });
  };

  const addTicket = () => {
    const selectedAuditorium = data?.data?.auditoriums?.find(
      (a) => a._id === formData.auditorium
    );
    updateFormData({
      tickets: [
        ...formData.tickets,
        {
          name: "",
          basePrice: undefined,
          capacity: selectedAuditorium?.capacity || 100,
          hasDiscount: false,
          discountType: "percentage",
        },
      ],
    });
  };

  const removeTicket = (ticketIndex: number) => {
    updateFormData({
      tickets: formData.tickets.filter((_, j) => j !== ticketIndex),
    });
  };

  const validateForm = (): boolean => {
    const result = ShowtimeSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Errors = {};
      result.error.issues.forEach((issue: ZodIssue) => {
        const path = issue.path.join(".");
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      toast.error("Please fill out all required fields correctly");
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await addShowtime(formData);
        toggleModal();
      } catch {
        // Error handled in addShowtime
      }
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={toggleModal}>
      <DialogContent
        className="sm:max-w-2xl h-full max-h-[80vh] flex flex-col overflow-hidden !p-0"
        // ref={dialogRef}
        // style={{ transform: "scale(0.95)", opacity: 0 }}
        // role="dialog"
        // aria-labelledby="dialog-title"
        // tabIndex={-1}
      >
        <DialogHeader className="px-6 py-6 border-b">
          <DialogTitle className="text-primary text-lg font-semibold">
            Add Showtime
          </DialogTitle>
          <DialogDescription className="text-gray-700 text-xs -mt-1">
            Add a new showtime to the movie schedule
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 h-full overflow-y-scroll p-6 pt-0">
          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Movie</Label>
            <Select
              value={formData.movieId}
              onValueChange={(value) => handleInputChange("movieId", value)}
              disabled={isLoading || moviesLoading}
            >
              <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer disabled:bg-muted">
                <SelectValue placeholder="Select movie" />
              </SelectTrigger>
              <SelectContent>
                {(moviesData?.data || []).map((movie: Record<string, unknown>) => (
                  <SelectItem
                    key={movie._id as string}
                    value={movie._id as string}
                    className="text-xs cursor-pointer"
                  >
                    {movie.title as string}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.movieId && (
              <p className="text-xs text-red-600">{errors.movieId}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
              disabled={isLoading}
            />
            {errors.date && (
              <p className="text-xs text-red-600">{errors.date}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Start Time</Label>
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
              disabled={isLoading}
            />
            {errors.startTime && (
              <p className="text-xs text-red-600">{errors.startTime}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Auditorium</Label>
            <Select
              value={formData.auditorium}
              onValueChange={(value) => {
                handleInputChange("auditorium", value);
                const selectedAuditorium = data?.data?.auditoriums?.find(
                  (a) => a._id === value
                );
                updateFormData({
                  tickets: formData.tickets.map((ticket) => ({
                    ...ticket,
                    capacity: selectedAuditorium?.capacity || 100,
                  })),
                });
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer disabled:bg-muted">
                <SelectValue placeholder="Select auditorium" />
              </SelectTrigger>
              <SelectContent>
                {(data?.data?.auditoriums || []).map((aud) => (
                  <SelectItem
                    key={aud._id}
                    value={aud._id as string}
                    className="text-xs cursor-pointer"
                  >
                    {aud.name} ({aud.screenType})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.auditorium && (
              <p className="text-xs text-red-600">{errors.auditorium}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Tickets</Label>
            <div className="space-y-4">
              {formData.tickets.map((ticket, ticketIndex) => (
                <div key={ticketIndex} className="border p-4 rounded-md space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600 text-xs">Ticket Name</Label>
                    <Input
                      placeholder="e.g. General Admission"
                      value={ticket.name}
                      onChange={(e) =>
                        handleTicketChange(ticketIndex, "name", e.target.value)
                      }
                      className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    />
                    {errors[`tickets.${ticketIndex}.name`] && (
                      <p className="text-xs text-red-600">
                        {errors[`tickets.${ticketIndex}.name`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600 text-xs">Base Price (NGN)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 5000"
                      value={ticket.basePrice ?? ""}
                      onChange={(e) =>
                        handleTicketChange(ticketIndex, "basePrice", e.target.value)
                      }
                      className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    />
                    {errors[`tickets.${ticketIndex}.basePrice`] && (
                      <p className="text-xs text-red-600">
                        {errors[`tickets.${ticketIndex}.basePrice`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600 text-xs">Capacity</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 50"
                      value={ticket.capacity ?? ""}
                      onChange={(e) =>
                        handleTicketChange(ticketIndex, "capacity", e.target.value)
                      }
                      className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    />
                    {errors[`tickets.${ticketIndex}.capacity`] && (
                      <p className="text-xs text-red-600">
                        {errors[`tickets.${ticketIndex}.capacity`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`hasDiscount-${ticketIndex}`}
                        checked={ticket.hasDiscount}
                        onCheckedChange={(checked) =>
                          handleTicketChange(ticketIndex, "hasDiscount", !!checked)
                        }
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor={`hasDiscount-${ticketIndex}`}
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        Apply Discount
                      </Label>
                    </div>
                  </div>
                  {ticket.hasDiscount && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-gray-600 text-xs">Discount Type</Label>
                        <Select
                          value={ticket.discountType}
                          onValueChange={(value) =>
                            handleTicketChange(ticketIndex, "discountType", value)
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
                        {errors[`tickets.${ticketIndex}.discountType`] && (
                          <p className="text-xs text-red-600">
                            {errors[`tickets.${ticketIndex}.discountType`]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600 text-xs">
                          Discount Value {ticket.discountType === "percentage" ? "(%)" : "(Amount)"}
                        </Label>
                        <Input
                          type="number"
                          placeholder={ticket.discountType === "percentage" ? "e.g. 10" : "e.g. 5000"}
                          value={ticket.discountValue ?? ""}
                          onChange={(e) =>
                            handleTicketChange(ticketIndex, "discountValue", e.target.value)
                          }
                          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                        />
                        {errors[`tickets.${ticketIndex}.discountValue`] && (
                          <p className="text-xs text-red-600">
                            {errors[`tickets.${ticketIndex}.discountValue`]}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  {formData.tickets.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeTicket(ticketIndex)}
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
                onClick={addTicket}
                className="bg-primary/10 text-primary text-xs border-none shadow-none hover:bg-primary/15 hover:text-primary cursor-pointer transition-colors ease-in-out duration-200"
                disabled={isLoading || isPending || !formData.auditorium}
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
            {errors.tickets && (
              <p className="text-xs text-red-600">{errors.tickets}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={toggleModal}
              className="text-xs cursor-pointer hover:bg-muted shadow-none transition-all ease-in-out duration-300"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-xs cursor-pointer transition-all ease-in-out duration-300"
              disabled={isPending}
            >
              {isPending ? "Adding showtime..." : "Add Showtime"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddShowtimeModal;