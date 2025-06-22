import React from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BsAsterisk } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const FormSchema = z
  .object({
    checkIn: z.date({
      required_error: "Check-in date is required.",
      invalid_type_error: "Invalid date format.",
    }),
    checkOut: z.date({
      required_error: "Check-out date is required.",
      invalid_type_error: "Invalid date format.",
    }),
    checkInTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Invalid time format (HH:mm).",
    }),
    checkOutTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Invalid time format (HH:mm).",
    }),
    numberOfGuests: z.number().min(1, {
      message: "At least one guest is required.",
    }),
  })
  .refine(
    (data) => {
      const checkInDateTime = parse(
        `${format(data.checkIn, "yyyy-MM-dd")} ${data.checkInTime}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      const checkOutDateTime = parse(
        `${format(data.checkOut, "yyyy-MM-dd")} ${data.checkOutTime}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      return checkOutDateTime > checkInDateTime;
    },
    {
      message: "Check-out must be after check-in.",
      path: ["checkOutTime"],
    }
  );

const DatePicker: React.FC<{
  name: string;
  label: string;
  placeholder?: string;
}> = ({ name, label, placeholder = "Select date" }) => {
  return (
    <FormField
      control={useForm().control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary text-xs font-medium">
            {label}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full bg-white text-xs rounded-lg justify-between font-normal shadow-none cursor-pointer hover:bg-white !py-5",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-3.5 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const TimePicker: React.FC<{
  name: string;
  label: string;
  placeholder?: string;
}> = ({ name, label }) => {
  return (
    <FormField
      control={useForm().control}
      name={name}
      render={({ field }) => {
        const [hour, minute] = field.value ? field.value.split(":") : ["", ""];
        return (
          <FormItem>
            <FormLabel className="text-primary text-xs font-medium">
              {label}
            </FormLabel>
            <div className="w-full flex gap-2">
              <Select
                value={hour}
                onValueChange={(value) => {
                  const newTime = `${value}:${minute || "00"}`;
                  field.onChange(newTime);
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full bg-white text-xs rounded-lg justify-between font-normal shadow-none cursor-pointer hover:bg-white !py-5">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem
                      key={i}
                      value={String(i).padStart(2, "0")}
                      className="text-xs cursor-pointer"
                    >
                      {String(i).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={minute}
                onValueChange={(value) => {
                  const newTime = `${hour || "00"}:${value}`;
                  field.onChange(newTime);
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full bg-white text-xs rounded-lg justify-between font-normal shadow-none cursor-pointer hover:bg-white !py-5">
                    <SelectValue placeholder="Minute" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["00", "15", "30", "45"].map((min) => (
                    <SelectItem
                      key={min}
                      value={min}
                      className="text-xs cursor-pointer"
                    >
                      {min}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

const RightSide = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      checkIn: undefined,
      checkOut: undefined,
      checkInTime: "",
      checkOutTime: "",
      numberOfGuests: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const checkInDateTime = parse(
      `${format(data.checkIn, "yyyy-MM-dd")} ${data.checkInTime}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    const checkOutDateTime = parse(
      `${format(data.checkOut, "yyyy-MM-dd")} ${data.checkOutTime}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    console.log({
      checkIn: checkInDateTime.toISOString(),
      checkOut: checkOutDateTime.toISOString(),
      numberOfGuests: data.numberOfGuests,
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-gray-100/80 rounded-xl p-5">
            <h3 className="text-primary text-base font-semibold">
              ₦ 245,000 / Night
            </h3>
            <p className="text-gray-700 text-xs mt-1.5">Total before taxes</p>
            <hr className="my-4" />
            <div className="grid grid-cols-1 space-y-4">
              <DatePicker
                name="checkIn"
                label="Check-in date"
                placeholder="Select check-in date"
              />
              <TimePicker
                name="checkInTime"
                label="Check-in time"
                placeholder="Select check-in time"
              />
              <DatePicker
                name="checkOut"
                label="Check-out date"
                placeholder="Select check-out date"
              />
              <TimePicker
                name="checkOutTime"
                label="Check-out time"
                placeholder="Select check-out time"
              />
              <FormField
                control={form.control}
                name="numberOfGuests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary text-xs font-medium">
                      Number of guests
                    </FormLabel>
                    <Input placeholder="Enter number of guests" className="bg-white shadow-none !px-3.5 !py-5 placeholder:text-xs focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200" />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="bg-white rounded-lg p-5 mt-4">
              <h3 className="text-primary font-semibold text-[13px] mb-4">
                Pricing Breakdown
              </h3>
              <hr />
              <div className="space-y-6">
                <div className="flex items-start justify-between mt-4">
                  <div>
                    <h3 className="text-primary text-[13px] font-semibold">
                      Rental price
                    </h3>
                    <p className="text-gray-700 text-[11px] mt-1">
                      245k/day (x7 days)
                    </p>
                  </div>
                  <span className="text-gray-700 text-[13px] font-semibold">
                    ₦ 245,000
                  </span>
                </div>
                <div className="flex items-start justify-between mt-4">
                  <div>
                    <h3 className="text-primary text-[13px] font-semibold">
                      Refundable deposit
                    </h3>
                    <p className="text-gray-700 text-[11px] mt-1">
                      Refunded by Aug 4th
                    </p>
                  </div>
                  <span className="text-gray-700 text-[13px] font-semibold">
                    ₦ 50,000
                  </span>
                </div>
                <div className="flex items-start justify-between mt-4">
                  <div>
                    <h3 className="text-primary text-[13px] font-semibold">
                      Discount
                    </h3>
                    <p className="text-gray-700 text-[11px] mt-1">
                      None available
                    </p>
                  </div>
                  <span className="text-gray-700 text-[13px] font-semibold">
                    - ₦ 0
                  </span>
                </div>
                <hr />
                <div className="flex items-start justify-between mt-4">
                  <div>
                    <h3 className="text-primary text-[13px] font-semibold">
                      Total price due
                    </h3>
                  </div>
                  <span className="text-gray-700 text-[13px] font-semibold">
                    - ₦ 295,000
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <BsAsterisk size={13} className="text-red-600 mt-[2px]" />
                  <p className="text-gray-700 text-[11px]/relaxed">
                    Your total amount due will be calculated depending on the
                    check-in and check-out dates.
                  </p>
                </div>
                <Button className="w-full bg-primary text-white text-[13px] font-semibold rounded-lg cursor-pointer !py-6">
                  Continue to checkout
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RightSide;