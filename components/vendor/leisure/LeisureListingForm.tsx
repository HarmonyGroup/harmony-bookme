"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { ImageIcon } from "@phosphor-icons/react";
import { useCreateLeisureListing, useUpdateLeisureListing } from "@/services/vendor/leisure";
import { LeisureListing } from "@/types/vendor/leisure";
import Image from "next/image";

// Zod schemas
const TicketSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  pricingStructure: z.enum(["perPerson", "perGroup", "flatFee"], {
    message: "Pricing structure is required",
  }),
  basePrice: z.number().positive("Price must be positive"),
  capacity: z.number().positive("Capacity must be positive").min(1, "Capacity is required"),
  hasDiscount: z.boolean().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.number().positive("Discount value must be positive").optional(),
  minimumBookingsRequired: z.number().positive("Minimum bookings must be positive").optional(),
}).refine(
  (data) =>
    !data.hasDiscount ||
    (data.discountType !== undefined && data.discountValue !== undefined),
  {
    message: "Discount type and value are required when discount is enabled",
    path: ["discountType"],
  }
);

const FormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description cannot exceed 1000 characters" }),
  shortSummary: z
    .string()
    .min(10, { message: "Summary must be at least 10 characters" })
    .max(200, { message: "Summary cannot exceed 200 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().min(1, { message: "Subcategory is required" }),
  highlights: z
    .array(z.string().min(1, "Highlight cannot be empty"))
    .min(1, { message: "At least one highlight is required" }),
  eventDateType: z.enum(["single", "multiple", "recurring"], {
    message: "Event date type is required",
  }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  venueName: z.string().min(1, { message: "Venue name is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State/Region is required" }),
  city: z.string().min(1, { message: "City is required" }),
  zipcode: z.string().min(1, { message: "Zipcode is required" }),
  addressDetails: z.string().min(1, { message: "Address details are required" }),
  tickets: z.array(TicketSchema).min(1, { message: "At least one ticket is required" }),
  images: z
    .array(z.string().url({ message: "Each image must be a valid URL" }))
    .min(1, { message: "At least one image is required" }),
  ageRestriction: z.string().min(1, { message: "Age restriction is required" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, { message: "At least one tag is required" }),
  dressCode: z.string().min(1, { message: "Dress code is required" }),
  inclusions: z
    .array(z.string().min(1, "Inclusion cannot be empty"))
    .min(1, { message: "At least one inclusion is required" }),
  childrenPolicy: z.enum(["allowed", "notAllowed", "specific"], {
    message: "Children policy is required",
  }),
  petPolicy: z.enum(["allowed", "notAllowed", "specific"], {
    message: "Pet policy is required",
  }),
  accessibilityFeatures: z.array(z.string()).min(1, { message: "At least one accessibility feature is required" }),
  termsAndConditions: z
    .string()
    .min(10, { message: "Terms and conditions must be at least 10 characters" }),
});

// Types for form data
type FormData = z.infer<typeof FormSchema>;
type Errors = Record<string, string>;
type StepKey = 1 | 2 | 3 | 4 | 5 | 6;

// Mock categories and subcategories
const CATEGORIES = [
  { id: "tours", name: "Tours" },
  { id: "workshops", name: "Workshops" },
  { id: "outdoor", name: "Outdoor Activities" },
  { id: "entertainment", name: "Entertainment" },
];
const SUBCATEGORIES = {
  tours: ["City Tour", "Historical Tour", "Food Tour"],
  workshops: ["Cooking Class", "Art Workshop", "Yoga Session"],
  outdoor: ["Hiking", "Kayaking", "Camping"],
  entertainment: ["Concert", "Comedy Show", "Theater"],
};

const STEPS = [
  { id: 1, title: "Basic Information", description: "Activity details and highlights" },
  { id: 2, title: "Date and Time", description: "Schedule the activity" },
  { id: 3, title: "Location and Venue", description: "Specify the venue details" },
  { id: 4, title: "Capacity and Pricing", description: "Set tickets and pricing" },
  { id: 5, title: "Details and Media", description: "Add images and specifics" },
  { id: 6, title: "Policies", description: "Define rules and accommodations" },
];

// Step 1: Basic Information
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
    value: FormData[K]
  ) => {
    updateFormData({ [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleArrayChange = (field: "highlights" | "tags" | "inclusions", value: string, action: "add" | "remove") => {
    if (action === "add" && value.trim() && !formData[field].includes(value.trim())) {
      updateFormData({ [field]: [...formData[field], value.trim()] });
    } else if (action === "remove") {
      updateFormData({ [field]: formData[field].filter((item) => item !== value) });
    }
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Activity Title</Label>
        <Input
          placeholder="e.g. Sunset Kayaking Adventure"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Short Summary</Label>
        <Textarea
          placeholder="Brief teaser for the activity (140-200 characters)"
          value={formData.shortSummary}
          onChange={(e) => handleInputChange("shortSummary", e.target.value)}
          className="h-full min-h-20 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.shortSummary && (
          <p className="text-xs text-red-600">{errors.shortSummary}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Description</Label>
        <Textarea
          placeholder="Describe the activity in detail"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="h-full min-h-40 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => {
            updateFormData({ category: value, subcategory: "" });
            setErrors({ ...errors, category: "", subcategory: "" });
          }}
        >
          <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} className="text-xs cursor-pointer">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-red-600">{errors.category}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Subcategory</Label>
        <Select
          value={formData.subcategory}
          onValueChange={(value) => handleInputChange("subcategory", value)}
          disabled={!formData.category}
        >
          <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer disabled:bg-muted">
            <SelectValue placeholder="Select subcategory" />
          </SelectTrigger>
          <SelectContent>
            {formData.category &&
              SUBCATEGORIES[formData.category as keyof typeof SUBCATEGORIES]?.map((sub) => (
                <SelectItem key={sub} value={sub} className="text-xs cursor-pointer">
                  {sub}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {errors.subcategory && (
          <p className="text-xs text-red-600">{errors.subcategory}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Highlights</Label>
        <div className="flex flex-wrap gap-2">
          {formData.highlights.map((highlight, index) => (
            <Badge
              key={index}
              className="text-xs cursor-pointer"
              onClick={() => handleArrayChange("highlights", highlight, "remove")}
            >
              {highlight} <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
        <Input
          placeholder="Add a highlight (e.g., Guided by experts)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleArrayChange("highlights", e.currentTarget.value, "add");
              e.currentTarget.value = "";
            }
          }}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.highlights && <p className="text-xs text-red-600">{errors.highlights}</p>}
      </div>
    </div>
  );
};

// Step 2: Date and Time
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
        <Label className="text-gray-600 text-xs">Event Date Type</Label>
        <Select
          value={formData.eventDateType}
          onValueChange={(value) =>
            handleInputChange("eventDateType", value as "single" | "multiple" | "recurring")
          }
        >
          <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
            <SelectValue placeholder="Select event date type" />
          </SelectTrigger>
          <SelectContent>
            {["single", "multiple", "recurring"].map((type) => (
              <SelectItem key={type} value={type} className="text-xs cursor-pointer">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.eventDateType && (
          <p className="text-xs text-red-600">{errors.eventDateType}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Start Date</Label>
        <Input
          type="date"
          value={formData.startDate}
          onChange={(e) => handleInputChange("startDate", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.startDate && <p className="text-xs text-red-600">{errors.startDate}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Start Time</Label>
        <Input
          type="time"
          value={formData.startTime}
          onChange={(e) => handleInputChange("startTime", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.startTime && <p className="text-xs text-red-600">{errors.startTime}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">End Date</Label>
        <Input
          type="date"
          value={formData.endDate}
          onChange={(e) => handleInputChange("endDate", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.endDate && <p className="text-xs text-red-600">{errors.endDate}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">End Time</Label>
        <Input
          type="time"
          value={formData.endTime}
          onChange={(e) => handleInputChange("endTime", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.endTime && <p className="text-xs text-red-600">{errors.endTime}</p>}
      </div>
    </div>
  );
};

// Step 3: Location and Venue
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
        <Label className="text-gray-600 text-xs">Venue Name</Label>
        <Input
          placeholder="e.g. Blue Wave Beach"
          value={formData.venueName}
          onChange={(e) => handleInputChange("venueName", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.venueName && <p className="text-xs text-red-600">{errors.venueName}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Country</Label>
        <Input
          placeholder="e.g. United States"
          value={formData.country}
          onChange={(e) => handleInputChange("country", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.country && <p className="text-xs text-red-600">{errors.country}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">State/Region</Label>
        <Input
          placeholder="e.g. California"
          value={formData.state}
          onChange={(e) => handleInputChange("state", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.state && <p className="text-xs text-red-600">{errors.state}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">City</Label>
        <Input
          placeholder="e.g. San Diego"
          value={formData.city}
          onChange={(e) => handleInputChange("city", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Zipcode</Label>
        <Input
          placeholder="e.g. 92101"
          value={formData.zipcode}
          onChange={(e) => handleInputChange("zipcode", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.zipcode && <p className="text-xs text-red-600">{errors.zipcode}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Address Details</Label>
        <Input
          placeholder="e.g. Meet at the main entrance"
          value={formData.addressDetails}
          onChange={(e) => handleInputChange("addressDetails", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.addressDetails && (
          <p className="text-xs text-red-600">{errors.addressDetails}</p>
        )}
      </div>
    </div>
  );
};

// Step 4: Capacity and Pricing
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
  const handleTicketChange = (
    index: number,
    field: keyof z.infer<typeof TicketSchema>,
    value: unknown
  ) => {
    const updatedTickets = formData.tickets.map((ticket, i) =>
      i === index
        ? {
            ...ticket,
            [field]:
              field === "basePrice" || field === "capacity" || field === "discountValue" || field === "minimumBookingsRequired"
                ? value === "" ? undefined : Number(value)
                : field === "pricingStructure"
                ? value === "perPerson" || value === "perGroup" || value === "flatFee"
                  ? value
                  : ticket.pricingStructure
                : field === "discountType"
                ? value === "percentage" || value === "fixed"
                  ? value
                  : ticket.discountType
                : value,
            ...(field === "hasDiscount" && value && !ticket.discountType
              ? { discountType: "percentage" as const }
              : {}),
          }
        : ticket
    );
    updateFormData({ tickets: updatedTickets });
    setErrors({ ...errors, [`tickets.${index}.${field}`]: "" });
  };

  const addTicket = () => {
    updateFormData({
      tickets: [
        ...formData.tickets,
        {
          name: "",
          pricingStructure: "perPerson",
          basePrice: 0,
          capacity: 0,
          hasDiscount: false,
          discountType: "percentage",
          minimumBookingsRequired: undefined,
        },
      ],
    });
  };

  const removeTicket = (index: number) => {
    updateFormData({
      tickets: formData.tickets.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Tickets</Label>
        <div className="space-y-4">
          {formData.tickets.map((ticket, index) => (
            <div key={index} className="border p-4 rounded-md space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Ticket Name</Label>
                <Input
                  placeholder="e.g. General Admission"
                  value={ticket.name}
                  onChange={(e) => handleTicketChange(index, "name", e.target.value)}
                  className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                />
                {errors[`tickets.${index}.name`] && (
                  <p className="text-xs text-red-600">{errors[`tickets.${index}.name`]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Pricing Structure</Label>
                <Select
                  value={ticket.pricingStructure}
                  onValueChange={(value) =>
                    handleTicketChange(index, "pricingStructure", value)
                  }
                >
                  <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
                    <SelectValue placeholder="Select pricing structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {["perPerson", "perGroup", "flatFee"].map((type) => (
                      <SelectItem key={type} value={type} className="text-xs cursor-pointer">
                        {type === "perPerson"
                          ? "Per Person"
                          : type === "perGroup"
                          ? "Per Group"
                          : "Flat Fee"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`tickets.${index}.pricingStructure`] && (
                  <p className="text-xs text-red-600">
                    {errors[`tickets.${index}.pricingStructure`]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Base Price</Label>
                <Input
                  type="number"
                  placeholder="e.g. 50"
                  value={ticket.basePrice ?? ""}
                  onChange={(e) => handleTicketChange(index, "basePrice", e.target.value)}
                  className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                />
                {errors[`tickets.${index}.basePrice`] && (
                  <p className="text-xs text-red-600">{errors[`tickets.${index}.basePrice`]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Capacity</Label>
                <Input
                  type="number"
                  placeholder="e.g. 20"
                  value={ticket.capacity ?? ""}
                  onChange={(e) => handleTicketChange(index, "capacity", e.target.value)}
                  className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                />
                {errors[`tickets.${index}.capacity`] && (
                  <p className="text-xs text-red-600">{errors[`tickets.${index}.capacity`]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Minimum Bookings Required (Optional)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  value={ticket.minimumBookingsRequired ?? ""}
                  onChange={(e) =>
                    handleTicketChange(index, "minimumBookingsRequired", e.target.value)
                  }
                  className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                />
                {errors[`tickets.${index}.minimumBookingsRequired`] && (
                  <p className="text-xs text-red-600">
                    {errors[`tickets.${index}.minimumBookingsRequired`]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`hasDiscount-${index}`}
                    checked={ticket.hasDiscount}
                    onCheckedChange={(checked) =>
                      handleTicketChange(index, "hasDiscount", !!checked)
                    }
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor={`hasDiscount-${index}`}
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
                        handleTicketChange(index, "discountType", value)
                      }
                    >
                      <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage" className="text-xs cursor-pointer">
                          Percentage
                        </SelectItem>
                        <SelectItem value="fixed" className="text-xs cursor-pointer">
                          Fixed Amount
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors[`tickets.${index}.discountType`] && (
                      <p className="text-xs text-red-600">
                        {errors[`tickets.${index}.discountType`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600 text-xs">
                      Discount Value {ticket.discountType === "percentage" ? "(%)" : "(Amount)"}
                    </Label>
                    <Input
                      type="number"
                      placeholder={ticket.discountType === "percentage" ? "e.g. 10" : "e.g. 5"}
                      value={ticket.discountValue ?? ""}
                      onChange={(e) =>
                        handleTicketChange(index, "discountValue", e.target.value)
                      }
                      className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    />
                    {errors[`tickets.${index}.discountValue`] && (
                      <p className="text-xs text-red-600">
                        {errors[`tickets.${index}.discountValue`]}
                      </p>
                    )}
                  </div>
                </>
              )}
              {formData.tickets.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeTicket(index)}
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
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.3"
              stroke="currentColor"
              className="size-[14px]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Ticket
          </Button>
        </div>
        {errors.tickets && <p className="text-xs text-red-600">{errors.tickets}</p>}
      </div>
    </div>
  );
};

// Step 5: Details and Media
interface Step5Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors: Errors;
  setErrors: (errors: Errors) => void;
}

const Step5Form: React.FC<Step5Props> = ({
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

  const handleArrayChange = (field: "tags" | "inclusions", value: string, action: "add" | "remove") => {
    if (action === "add" && value.trim() && !formData[field].includes(value.trim())) {
      updateFormData({ [field]: [...formData[field], value.trim()] });
    } else if (action === "remove") {
      updateFormData({ [field]: formData[field].filter((item) => item !== value) });
    }
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
      toast.error(`Failed to upload images: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setUploadingFiles((prev) => prev.filter((name) => !newUploading.includes(name)));
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Images</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
              <ImageIcon size={24} className="mx-auto text-center text-gray-500" />
              <p className="text-[11px] text-gray-500 mt-2">
                Drag photos here or click to browse
              </p>
              <p className="text-[10px] text-gray-400 mt-1.5">JPEG/PNG, max 5MB</p>
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
                className="w-full h-full object-cover rounded-lg"
                width={176}
                height={176}
                priority
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
        {errors.images && <p className="text-xs text-red-600">{errors.images}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Age Restriction</Label>
        <Input
          placeholder="e.g. 18+"
          value={formData.ageRestriction}
          onChange={(e) => handleInputChange("ageRestriction", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.ageRestriction && (
          <p className="text-xs text-red-600">{errors.ageRestriction}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Requirements</Label>
        <Textarea
          placeholder="e.g. Swimming skills, Bring ID"
          value={formData.requirements}
          onChange={(e) => handleInputChange("requirements", e.target.value)}
          className="h-full min-h-20 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.requirements && (
          <p className="text-xs text-red-600">{errors.requirements}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Tags</Label>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <Badge
              key={index}
              className="text-xs cursor-pointer"
              onClick={() => handleArrayChange("tags", tag, "remove")}
            >
              {tag} <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
        <Input
          placeholder="Add a tag (e.g. adventure)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleArrayChange("tags", e.currentTarget.value, "add");
              e.currentTarget.value = "";
            }
          }}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.tags && <p className="text-xs text-red-600">{errors.tags}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Dress Code</Label>
        <Input
          placeholder="e.g. Casual"
          value={formData.dressCode}
          onChange={(e) => handleInputChange("dressCode", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.dressCode && <p className="text-xs text-red-600">{errors.dressCode}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Inclusions</Label>
        <div className="flex flex-wrap gap-2">
          {formData.inclusions.map((inclusion, index) => (
            <Badge
              key={index}
              className="text-xs cursor-pointer"
              onClick={() => handleArrayChange("inclusions", inclusion, "remove")}
            >
              {inclusion} <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
        <Input
          placeholder="Add an inclusion (e.g. Equipment provided)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleArrayChange("inclusions", e.currentTarget.value, "add");
              e.currentTarget.value = "";
            }
          }}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.inclusions && <p className="text-xs text-red-600">{errors.inclusions}</p>}
      </div>
    </div>
  );
};

// Step 6: Policies
interface Step6Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors: Errors;
  setErrors: (errors: Errors) => void;
}

const Step6Form: React.FC<Step6Props> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
}) => {
  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    updateFormData({ [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleAccessibilityChange = (feature: string, checked: boolean) => {
    updateFormData({
      accessibilityFeatures: checked
        ? [...formData.accessibilityFeatures, feature]
        : formData.accessibilityFeatures.filter((f) => f !== feature),
    });
    setErrors({ ...errors, accessibilityFeatures: "" });
  };

  const accessibilityOptions = [
    "Wheelchair access",
    "Hearing assistance",
    "Visual aids",
    "Service animals allowed",
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Children Policy</Label>
        <Select
          value={formData.childrenPolicy}
          onValueChange={(value) =>
            handleInputChange("childrenPolicy", value as "allowed" | "notAllowed" | "specific")
          }
        >
          <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
            <SelectValue placeholder="Select children policy" />
          </SelectTrigger>
          <SelectContent>
            {["allowed", "notAllowed", "specific"].map((policy) => (
              <SelectItem key={policy} value={policy} className="text-xs cursor-pointer">
                {policy === "allowed"
                  ? "Children Allowed"
                  : policy === "notAllowed"
                  ? "Children Not Allowed"
                  : "Specific Age Rules"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.childrenPolicy && (
          <p className="text-xs text-red-600">{errors.childrenPolicy}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Pet Policy</Label>
        <Select
          value={formData.petPolicy}
          onValueChange={(value) =>
            handleInputChange("petPolicy", value as "allowed" | "notAllowed" | "specific")
          }
        >
          <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
            <SelectValue placeholder="Select pet policy" />
          </SelectTrigger>
          <SelectContent>
            {["allowed", "notAllowed", "specific"].map((policy) => (
              <SelectItem key={policy} value={policy} className="text-xs cursor-pointer">
                {policy === "allowed"
                  ? "Pets Allowed"
                  : policy === "notAllowed"
                  ? "Pets Not Allowed"
                  : "Specific Conditions"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.petPolicy && <p className="text-xs text-red-600">{errors.petPolicy}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Accessibility Features</Label>
        <div className="grid grid-cols-2 gap-5 mt-4">
          {accessibilityOptions.map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                id={`accessibility-${feature}`}
                checked={formData.accessibilityFeatures.includes(feature)}
                onCheckedChange={(checked) => handleAccessibilityChange(feature, !!checked)}
                className="cursor-pointer"
              />
              <Label
                htmlFor={`accessibility-${feature}`}
                className="text-xs text-gray-600 cursor-pointer"
              >
                {feature}
              </Label>
            </div>
          ))}
        </div>
        {errors.accessibilityFeatures && (
          <p className="text-xs text-red-600">{errors.accessibilityFeatures}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Terms and Conditions</Label>
        <Textarea
          placeholder="Enter terms and conditions"
          value={formData.termsAndConditions}
          onChange={(e) => handleInputChange("termsAndConditions", e.target.value)}
          className="h-full min-h-40 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.termsAndConditions && (
          <p className="text-xs text-red-600">{errors.termsAndConditions}</p>
        )}
      </div>
    </div>
  );
};

interface LeisureListingFormProps {
  listing?: LeisureListing;
}

const LeisureListingForm: React.FC<LeisureListingFormProps> = ({ listing }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepKey>(1);
  const [formData, setFormData] = useState<FormData>({
    title: listing?.title || "",
    description: listing?.description || "",
    shortSummary: listing?.shortSummary || "",
    category: listing?.category || "",
    subcategory: listing?.subcategory || "",
    highlights: listing?.highlights || [],
    eventDateType: listing?.eventDateType || "single",
    startDate: listing?.startDate || "",
    startTime: listing?.startTime || "",
    endDate: listing?.endDate || "",
    endTime: listing?.endTime || "",
    venueName: listing?.venueName || "",
    country: listing?.country || "",
    state: listing?.state || "",
    city: listing?.city || "",
    zipcode: listing?.zipcode || "",
    addressDetails: listing?.addressDetails || "",
    tickets: listing?.tickets?.length
      ? listing.tickets
      : [
          {
            name: "",
            pricingStructure: "perPerson",
            basePrice: 0,
            capacity: 0,
            hasDiscount: false,
            discountType: "percentage",
            minimumBookingsRequired: undefined,
          },
        ],
    images: listing?.images || [],
    ageRestriction: listing?.ageRestriction || "",
    requirements: listing?.requirements || "",
    tags: listing?.tags || [],
    dressCode: listing?.dressCode || "",
    inclusions: listing?.inclusions || [],
    childrenPolicy: listing?.childrenPolicy || "allowed",
    petPolicy: listing?.petPolicy || "notAllowed",
    accessibilityFeatures: listing?.accessibilityFeatures || [],
    termsAndConditions: listing?.termsAndConditions || "",
  });
  const [errors, setErrors] = useState<Errors>({});
  
  // API hooks
  const { mutate: createListing, isPending: creatingListing } = useCreateLeisureListing();
  const { mutate: updateListing, isPending: updatingListing } = useUpdateLeisureListing();
  const isPending = creatingListing || updatingListing;
  const isEditMode = !!listing?._id;

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        shortSummary: listing.shortSummary || "",
        category: listing.category || "",
        subcategory: listing.subcategory || "",
        highlights: listing.highlights || [],
        eventDateType: listing.eventDateType || "single",
        startDate: listing.startDate || "",
        startTime: listing.startTime || "",
        endDate: listing.endDate || "",
        endTime: listing.endTime || "",
        venueName: listing.venueName || "",
        country: listing.country || "",
        state: listing.state || "",
        city: listing.city || "",
        zipcode: listing.zipcode || "",
        addressDetails: listing.addressDetails || "",
        tickets: listing.tickets?.length
          ? listing.tickets
          : [
              {
                name: "",
                pricingStructure: "perPerson",
                basePrice: 0,
                capacity: 0,
                hasDiscount: false,
                discountType: "percentage",
                minimumBookingsRequired: undefined,
              },
            ],
        images: listing.images || [],
        ageRestriction: listing.ageRestriction || "",
        requirements: listing.requirements || "",
        tags: listing.tags || [],
        dressCode: listing.dressCode || "",
        inclusions: listing.inclusions || [],
        childrenPolicy: listing.childrenPolicy || "allowed",
        petPolicy: listing.petPolicy || "notAllowed",
        accessibilityFeatures: listing.accessibilityFeatures || [],
        termsAndConditions: listing.termsAndConditions || "",
      });
    }
  }, [listing]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  type StepData = {
    1: Pick<FormData, "title" | "description" | "shortSummary" | "category" | "subcategory" | "highlights">;
    2: Pick<FormData, "eventDateType" | "startDate" | "startTime" | "endDate" | "endTime">;
    3: Pick<FormData, "venueName" | "country" | "state" | "city" | "zipcode" | "addressDetails">;
    4: Pick<FormData, "tickets">;
    5: Pick<FormData, "images" | "ageRestriction" | "requirements" | "tags" | "dressCode" | "inclusions">;
    6: Pick<FormData, "childrenPolicy" | "petPolicy" | "accessibilityFeatures" | "termsAndConditions">;
  };

  const validateStep = (step: StepKey): boolean => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stepSchemas: Record<StepKey, z.ZodObject<any>> = {
      1: z.object({
        title: FormSchema.shape.title,
        description: FormSchema.shape.description,
        shortSummary: FormSchema.shape.shortSummary,
        category: FormSchema.shape.category,
        subcategory: FormSchema.shape.subcategory,
        highlights: FormSchema.shape.highlights,
      }),
      2: z.object({
        eventDateType: FormSchema.shape.eventDateType,
        startDate: FormSchema.shape.startDate,
        startTime: FormSchema.shape.startTime,
        endDate: FormSchema.shape.endDate,
        endTime: FormSchema.shape.endTime,
      }),
      3: z.object({
        venueName: FormSchema.shape.venueName,
        country: FormSchema.shape.country,
        state: FormSchema.shape.state,
        city: FormSchema.shape.city,
        zipcode: FormSchema.shape.zipcode,
        addressDetails: FormSchema.shape.addressDetails,
      }),
      4: z.object({
        tickets: FormSchema.shape.tickets,
      }),
      5: z.object({
        images: FormSchema.shape.images,
        ageRestriction: FormSchema.shape.ageRestriction,
        requirements: FormSchema.shape.requirements,
        tags: FormSchema.shape.tags,
        dressCode: FormSchema.shape.dressCode,
        inclusions: FormSchema.shape.inclusions,
      }),
      6: z.object({
        childrenPolicy: FormSchema.shape.childrenPolicy,
        petPolicy: FormSchema.shape.petPolicy,
        accessibilityFeatures: FormSchema.shape.accessibilityFeatures,
        termsAndConditions: FormSchema.shape.termsAndConditions,
      }),
    };

    const stepData: StepData = {
      1: {
        title: formData.title,
        description: formData.description,
        shortSummary: formData.shortSummary,
        category: formData.category,
        subcategory: formData.subcategory,
        highlights: formData.highlights,
      },
      2: {
        eventDateType: formData.eventDateType,
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,
      },
      3: {
        venueName: formData.venueName,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zipcode: formData.zipcode,
        addressDetails: formData.addressDetails,
      },
      4: {
        tickets: formData.tickets,
      },
      5: {
        images: formData.images,
        ageRestriction: formData.ageRestriction,
        requirements: formData.requirements,
        tags: formData.tags,
        dressCode: formData.dressCode,
        inclusions: formData.inclusions,
      },
      6: {
        childrenPolicy: formData.childrenPolicy,
        petPolicy: formData.petPolicy,
        accessibilityFeatures: formData.accessibilityFeatures,
        termsAndConditions: formData.termsAndConditions,
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
      setCurrentStep((prev) => (prev < 6 ? ((prev + 1) as StepKey) : prev));
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

      // Transform tickets to include _id properties
      const transformedTickets = formData.tickets?.map((ticket) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _id: (ticket as any)._id || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: ticket.name,
        basePrice: ticket.basePrice!,
        pricingStructure: ticket.pricingStructure,
        capacity: ticket.capacity!,
        hasDiscount: ticket.hasDiscount || false,
        discountType: ticket.hasDiscount ? (ticket.discountType || "percentage") : undefined,
        discountValue: ticket.hasDiscount ? (ticket.discountValue || 0) : undefined,
        minimumBookingsRequired: ticket.minimumBookingsRequired,
      }));

      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        tickets: transformedTickets,
      };

      if (isEditMode) {
        updateListing(
          { id: listing._id!, data: payload as any }, // eslint-disable-line @typescript-eslint/no-explicit-any
          {
            onSuccess: (response) => {
              toast.success(response?.message ?? "Listing updated successfully");
              router.push(`/vendor/leisure`);
            },
            onError: (error) => {
              toast.error("Failed to update listing: " + error.message);
            },
          }
        );
      } else {
        createListing(payload as any, { // eslint-disable-line @typescript-eslint/no-explicit-any
          onSuccess: (response) => {
            toast.success(response?.message ?? "Listing created successfully");
            router.push(`/vendor/leisure`);
          },
          onError: (error) => {
            toast.error("Failed to create listing: " + error.message);
          },
        });
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
      case 5:
        return (
          <Step5Form
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 6:
        return (
          <Step6Form
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
    <div className="h-full">
      <div className="flex items-center justify-between border-b p-4 md:p-8">
        <div>
          <h3 className="text-primary text-lg font-semibold">
            {isEditMode ? "Edit Leisure Listing" : "New Leisure Listing"}
          </h3>
          <p className="text-gray-500 text-xs mt-1">
            {isEditMode
              ? "Update details for your leisure activity"
              : "Create a new leisure activity listing"}
          </p>
        </div>
      </div>

      <div className="h-full grid grid-cols-4">
        <div className="hidden md:block col-span-1">
          <div className="h-full border-r px-10 py-8">
            <ol className="relative border-s border-gray-200">
              {STEPS.map((step, index) => (
                <li
                  key={step.id}
                  className={index < STEPS.length - 1 ? "mb-10 ms-6" : "ms-6"}
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
        </div>

        <div className="col-span-4 md:col-span-3">
          <div className="p-4 md:p-8">
            <p className="text-gray-500 text-xs">
              Step {currentStep}/{STEPS.length}
            </p>
            <h3 className="text-primary text-lg font-semibold mt-1.5">
              {STEPS[currentStep - 1].title}
            </h3>
            <p className="text-gray-500 text-xs mt-1">
              {STEPS[currentStep - 1].description}
            </p>

            <div className="mt-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderStepContent()}
                <div className="flex justify-between pt-8 border-t">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      disabled={isPending}
                      className="text-xs cursor-pointer hover:bg-muted shadow-none transition-all ease-in-out duration-300"
                    >
                      Previous step
                    </Button>
                  )}
                  <div className="ml-auto">
                    {currentStep < STEPS.length ? (
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="text-xs cursor-pointer transition-all ease-in-out duration-300"
                        disabled={formData.images.length === 0 && currentStep === 5}
                      >
                        Next step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="text-xs cursor-pointer transition-all ease-in-out duration-300"
                      >
                        {isPending ? (
                          <span>
                            {isEditMode ? "Updating listing..." : "Creating listing..."}
                          </span>
                        ) : (
                          <span>{isEditMode ? "Update listing" : "Create listing"}</span>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeisureListingForm;