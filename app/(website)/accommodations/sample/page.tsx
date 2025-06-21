"use client";

import React, { useState } from "react";
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
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Details from "@/components/website/accommodations/listing/Details";
import Reviews from "@/components/website/accommodations/listing/Reviews";
import Policies from "@/components/website/accommodations/listing/Policies";
import Amenities from "@/components/website/accommodations/listing/Amenities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReportVendor from "@/components/website/shared/ReportVendor";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
          <FormLabel className="text-primary text-[11px] font-medium">
            {label}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full bg-white text-xs rounded-full justify-between font-normal shadow-none cursor-pointer hover:bg-white !py-5",
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
            <FormLabel className="text-primary text-[11px] font-medium">
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
                  <SelectTrigger className="w-full bg-white text-xs rounded-full justify-between font-normal shadow-none cursor-pointer hover:bg-white !py-5">
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
                  <SelectTrigger className="w-full bg-white text-xs rounded-full justify-between font-normal shadow-none cursor-pointer hover:bg-white !py-5">
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

const Page = () => {
  const [reportVendor, setReportVendor] = useState(false);

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
    <section className="py-10">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
        <Breadcrumb className="mb-6">
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Accommodations</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary">
                Five-bedroom-duplex-in-ikoyi
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="w-full grid grid-cols-3 gap-4">
          <div className="col-span-2">
            {/* Gallery */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <div>
                  <img
                    className="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg"
                    alt=""
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="">
                  <img
                    className="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg"
                    alt=""
                  />
                </div>
                <div className="">
                  <img
                    className="h-auto max-w-full rounded-lg"
                    src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg"
                    alt=""
                  />
                </div>
              </div>
            </div>
            {/* Main content */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-600 text-[13px]">
                    20A, Alaba Lawson, Lekki, Lagos
                  </span>
                  <h1 className="text-[#183264] text-lg md:text-xl/tight font-medium mt-1">
                    5 bedroom luxury duplex in Ikoyi
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-[13px] text-gray-600 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-yellow-500 size-[16px]"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      4.8
                    </div>
                    <Link
                      href={""}
                      className="text-[13px] text-gray-600 font-medium underline underline-offset-2"
                    >
                      44 reviews
                    </Link>
                  </div>
                </div>
              </div>
              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="w-full space-x-4 block bg-white border-b rounded-none !py-0 mb-4">
                  <TabsTrigger
                    value="details"
                    className="text-primary text-xs font-semibold !shadow-none data-[state=active]:!border-b-[1.8px] data-[state=active]:border-primary data-[state=active]:border-x-0 data-[state=active]:border-t-0 focus-visible:!border-b rounded-none cursor-pointer pl-0"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="amenities"
                    className="text-primary text-xs font-semibold !shadow-none data-[state=active]:!border-b-[1.8px] data-[state=active]:border-primary data-[state=active]:border-x-0 data-[state=active]:border-t-0 focus-visible:!border-b rounded-none cursor-pointer"
                  >
                    Amenities
                  </TabsTrigger>
                  <TabsTrigger
                    value="policies"
                    className="text-primary text-xs font-semibold !shadow-none data-[state=active]:!border-b-[1.8px] data-[state=active]:border-primary data-[state=active]:border-x-0 data-[state=active]:border-t-0 focus-visible:!border-b rounded-none cursor-pointer"
                  >
                    Policies
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="text-primary text-xs font-semibold !shadow-none data-[state=active]:!border-b-[1.8px] data-[state=active]:border-primary data-[state=active]:border-x-0 data-[state=active]:border-t-0 focus-visible:!border-b rounded-none cursor-pointer"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <Details />
                </TabsContent>
                <TabsContent value="amenities">
                  <Amenities />
                </TabsContent>
                <TabsContent value="policies">
                  <Policies />
                </TabsContent>
                <TabsContent value="reviews">
                  <Reviews />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="col-span-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="bg-primary/5 rounded-xl p-5">
                  <h3 className="text-primary text-[14px] font-semibold">
                    ₦245k / Night
                  </h3>
                  <p className="text-gray-700 text-xs mt-1.5">
                    Total before taxes
                  </p>
                  <hr className="my-4" />
                  <div className="grid grid-cols-1 space-y-4">
                    <DatePicker
                      name="checkIn"
                      label="Check-in Date"
                      placeholder="Select check-in date"
                    />
                    <TimePicker
                      name="checkInTime"
                      label="Check-in Time"
                      placeholder="Select check-in time"
                    />
                    <DatePicker
                      name="checkOut"
                      label="Check-out Date"
                      placeholder="Select check-out date"
                    />
                    <TimePicker
                      name="checkOutTime"
                      label="Check-out Time"
                      placeholder="Select check-out time"
                    />
                    <FormField
                      control={form.control}
                      name="numberOfGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary text-xs">
                            Number of guests
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            defaultValue={String(field.value)}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-white text-xs rounded-full shadow-none py-5">
                                <SelectValue placeholder="Select number of guests" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                            </SelectContent>
                          </Select>
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
                        <BsAsterisk
                          size={13}
                          className="text-red-600 mt-[2px]"
                        />
                        <p className="text-gray-700 text-[11px]/relaxed">
                          Your total amount due will be calculated depending on
                          the check-in and check-out dates.
                        </p>
                      </div>
                      <Button className="w-full bg-primary text-white text-[13px] font-semibold rounded-full cursor-pointer !py-6">
                        Continue to checkout
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bg-primary/5 rounded-xl p-5">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-6 flex items-center justify-center bg-primary rounded-full">
                        <span className="text-white text-xs font-semibold">
                          E
                        </span>
                      </div>
                      <span className="text-primary text-[13px] font-semibold">
                        Albert and Wand
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer hover:bg-primary/10 rounded-full p-1 duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setReportVendor(true)}
                          className="text-gray-600 text-xs cursor-pointer duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.6"
                            stroke="currentColor"
                            className="text-gray-600 size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                            />
                          </svg>
                          Report vendor
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <ReportVendor
                      showModal={reportVendor}
                      toggleModal={() => setReportVendor(!reportVendor)}
                    />
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <div className="size-10 flex items-center justify-center bg-primary rounded-full">
                      <span className="text-white text-sm font-semibold">E</span>
                    </div>
                    <div className="">
                      <span className="text-primary text-[13px] font-semibold">
                        Emmanuel Ackers
                      </span>
                      <p className="text-gray-700 text-[11px] mt-1">
                        Joined August 2025
                      </p>
                    </div>
                  </div> */}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;