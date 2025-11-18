"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";
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
import {
  EVENT_CATEGORIES,
  EVENT_FORMATS,
  EVENT_TYPES,
  VIRTUAL_PLATFORMS,
  DRESS_CODES,
} from "@/constants/events";
import { Plus, Trash2 } from "lucide-react";
import { useCreateEventListing } from "@/services/vendor/event";
import { useCreateAdminEventListing } from "@/services/admin/events";
import { usePathname } from "next/navigation";
import type { EventListing, CreateTicketType } from "@/types/event";
import moment from "moment";
import { usePreventZoomAggressive } from "@/hooks/use-prevent-zoom-aggressive";

// Zod schemas
const TicketSchema = z
  .object({
    name: z.string().min(1, "Ticket name is required"),
    pricingStructure: z.enum(["perPerson", "perGroup", "flatFee"], {
      message: "Pricing structure is required",
    }),
    basePrice: z.number().positive("Price must be greater than 0").optional(),
    capacity: z
      .number()
      .positive("Capacity must be positive")
      .min(1, "Capacity is required")
      .optional(),
    hasDiscount: z.boolean().optional(),
    discountType: z.enum(["percentage", "fixed"]).optional(),
    discountValue: z
      .number()
      .min(0, "Discount value must be positive")
      .optional(),
    minimumBookingsRequired: z
      .number()
      .positive("Minimum bookings must be positive")
      .optional(),
    soldCount: z.number().min(0).default(0),
  })
  .refine(
    (data) =>
      !data.hasDiscount ||
      (data.discountType !== undefined && data.discountValue !== undefined),
    {
      message: "Discount type and value are required when discount is enabled",
      path: ["discountType"],
    }
  )
  .refine((data) => data.basePrice !== undefined && data.basePrice > 0, {
    message: "Price is required and must be greater than 0",
    path: ["basePrice"],
  })
  .refine((data) => data.capacity !== undefined && data.capacity > 0, {
    message: "Capacity is required and must be greater than 0",
    path: ["capacity"],
  });

// Zod schema for form validation - removed unused variable

// Types for form data
type FormData = {
  // Step 1: Basic Information
  title: string;
  description: string;
  summary: string;
  category: string;
  eventType: string;
  format: "in-person" | "virtual";
  pricingType: "free" | "paid";
  freeEventCapacity?: number;

  // Step 2: Date & Time
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;

  // Step 3: Location & Venue (conditional based on format)
  venueName?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  streetAddress?: string;

  // Virtual Details (conditional based on format)
  virtualPlatform?: string;
  virtualMeetingLink?: string;
  virtualMeetingId?: string;
  virtualAccessInstructions?: string;
  virtualCapacity?: number;

  // Step 4: Tickets & Pricing
  tickets?: z.infer<typeof TicketSchema>[];

  // Step 5: Event Details & Media
  images: string[];
  ageRestriction?: number;
  requirements?: string[];
  tags?: string[];
  dressCode?: string;
  whatsIncluded?: string[];

  // Step 6: Policies
  childrenPolicy: "allowed" | "notAllowed";
  petPolicy: "allowed" | "notAllowed";
  smokingPolicy: "allowed" | "notAllowed";
};
type Errors = Record<string, string>;
type StepKey = 1 | 2 | 3 | 4 | 5 | 6;

const STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Event details and category",
  },
  { id: 2, title: "Date & Time", description: "When your event happens" },
  {
    id: 3,
    title: "Location & Venue",
    description: "Where your event takes place",
  },
  {
    id: 4,
    title: "Capacity & Pricing",
    description: "Event capacity and ticket pricing",
  },
  {
    id: 5,
    title: "Details & Media",
    description: "Additional details and images",
  },
  { id: 6, title: "Policies", description: "Terms and conditions" },
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Event Title</Label>
        <Input
          placeholder="e.g. Music Festival"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Event Description</Label>
        <Textarea
          placeholder="Describe your event, what attendees can expect, and why they should join..."
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="!py-3 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 min-h-40"
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Event Summary</Label>
        <Textarea
          placeholder="Brief summary of your event (max 200 characters)"
          value={formData.summary}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 200) {
              handleInputChange("summary", value);
            }
          }}
          className="!py-3 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 min-h-20"
        />
        <div className="flex justify-between items-center">
          {errors.summary && (
            <p className="text-xs text-red-600">{errors.summary}</p>
          )}
          <p className="text-xs text-gray-400 ml-auto">
            {formData.summary.length}/200 characters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Event Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_CATEGORIES.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-gray-600 text-xs !py-2.5 cursor-pointer"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs text-red-600">{errors.category}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Event Type</Label>
          <Select
            value={formData.eventType}
            onValueChange={(value) => handleInputChange("eventType", value)}
          >
            <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="text-gray-600 text-xs !py-2.5 cursor-pointer"
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.eventType && (
            <p className="text-xs text-red-600">{errors.eventType}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Event Format</Label>
          <Select
            value={formData.format}
            onValueChange={(value) =>
              handleInputChange("format", value as "in-person" | "virtual")
            }
          >
            <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_FORMATS.map((format) => (
                <SelectItem
                  key={format.value}
                  value={format.value}
                  className="text-gray-600 text-xs !py-2.5 cursor-pointer"
                >
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.format && (
            <p className="text-xs text-red-600">{errors.format}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Event Pricing</Label>
          <Select
            value={formData.pricingType}
            onValueChange={(value) =>
              handleInputChange("pricingType", value as "free" | "paid")
            }
          >
            <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
              <SelectValue placeholder="Select pricing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="free"
                className="text-gray-600 text-xs !py-2.5 cursor-pointer"
              >
                Free Event - No payment required
              </SelectItem>
              <SelectItem
                value="paid"
                className="text-gray-600 text-xs !py-2.5 cursor-pointer"
              >
                Paid Event - Requires ticket purchase
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.pricingType && (
            <p className="text-xs text-red-600">{errors.pricingType}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Step 2: Date & Time
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Start Date</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className="!py-6 !text-xs font-normal shadow-none focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
          />
          {errors.startDate && (
            <p className="text-xs text-red-600">{errors.startDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Start Time</Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
            className="!py-6 !text-xs font-normal shadow-none focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
          />
          {errors.startTime && (
            <p className="text-xs text-red-600">{errors.startTime}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">End Date</Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className="!py-6 !text-xs font-normal shadow-none focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
          />
          {errors.endDate && (
            <p className="text-xs text-red-600">{errors.endDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">End Time</Label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
            className="!py-6 !text-xs font-normal shadow-none focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
          />
          {errors.endTime && (
            <p className="text-xs text-red-600">{errors.endTime}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Step 3: Location & Venue
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
      {formData.format === "in-person" && (
        <div className="space-y-4">
          <h4 className="text-[13px] font-semibold my-6">Venue Information</h4>

          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Venue Name</Label>
            <Input
              placeholder="e.g. City Hall"
              value={formData.venueName || ""}
              onChange={(e) => handleInputChange("venueName", e.target.value)}
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors.venueName && (
              <p className="text-xs text-red-600">{errors.venueName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Street Address</Label>
            <Input
              placeholder="e.g. 123 Avenue"
              value={formData.streetAddress || ""}
              onChange={(e) =>
                handleInputChange("streetAddress", e.target.value)
              }
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors.streetAddress && (
              <p className="text-xs text-red-600">{errors.streetAddress}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-600 text-xs">City</Label>
              <Input
                placeholder="e.g. Victoria Island"
                value={formData.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
              />
              {errors.city && (
                <p className="text-xs text-red-600">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 text-xs">State</Label>
              <Input
                placeholder="e.g. Lagos"
                value={formData.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
              />
              {errors.state && (
                <p className="text-xs text-red-600">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-600 text-xs">Country</Label>
              <Input
                placeholder="e.g. Nigeria"
                value={formData.country || ""}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
              />
              {errors.country && (
                <p className="text-xs text-red-600">{errors.country}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 text-xs">
                ZIP Code (optional)
              </Label>
              <Input
                placeholder="e.g. 10001"
                value={formData.zipcode || ""}
                onChange={(e) => handleInputChange("zipcode", e.target.value)}
                className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
              />
              {errors.zipcode && (
                <p className="text-xs text-red-600">{errors.zipcode}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {formData.format === "virtual" && (
        <div className="space-y-4">
          <h4 className="text-[13px] font-semibold my-6">
            Virtual Event Details
          </h4>

          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Virtual Platform</Label>
            <Select
              value={formData.virtualPlatform || ""}
              onValueChange={(value) =>
                handleInputChange("virtualPlatform", value)
              }
            >
              <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {VIRTUAL_PLATFORMS.map((platform) => (
                  <SelectItem
                    key={platform}
                    value={platform}
                    className="text-gray-600 text-xs !py-2.5 cursor-pointer"
                  >
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.virtualPlatform && (
              <p className="text-xs text-red-600">{errors.virtualPlatform}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">
              Meeting Link (optional)
            </Label>
            <Input
              placeholder="https://zoom.us/j/123456789"
              value={formData.virtualMeetingLink || ""}
              onChange={(e) =>
                handleInputChange("virtualMeetingLink", e.target.value)
              }
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors.virtualMeetingLink && (
              <p className="text-xs text-red-600">
                {errors.virtualMeetingLink}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">
              Meeting ID (optional)
            </Label>
            <Input
              placeholder="123 456 7890"
              value={formData.virtualMeetingId || ""}
              onChange={(e) =>
                handleInputChange("virtualMeetingId", e.target.value)
              }
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors.virtualMeetingId && (
              <p className="text-xs text-red-600">{errors.virtualMeetingId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">
              Access Instructions (optional)
            </Label>
            <Textarea
              placeholder="Any special instructions for joining the virtual event..."
              value={formData.virtualAccessInstructions || ""}
              onChange={(e) =>
                handleInputChange("virtualAccessInstructions", e.target.value)
              }
              className="!py-3 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 min-h-20"
            />
            {errors.virtualAccessInstructions && (
              <p className="text-xs text-red-600">
                {errors.virtualAccessInstructions}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Virtual Capacity</Label>
            <Input
              type="number"
              min="1"
              placeholder="Enter maximum virtual attendees"
              value={formData.virtualCapacity || ""}
              onChange={(e) =>
                handleInputChange(
                  "virtualCapacity",
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors.virtualCapacity && (
              <p className="text-xs text-red-600">{errors.virtualCapacity}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Step 4: Capacity & Pricing
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
  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    updateFormData({ [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleTicketChange = (
    index: number,
    field: keyof z.infer<typeof TicketSchema>,
    value: string | number | boolean
  ) => {
    const updatedTickets = (formData.tickets || []).map((ticket, i) =>
      i === index
        ? {
            ...ticket,
            [field]:
              field === "basePrice" ||
              field === "capacity" ||
              field === "discountValue" ||
              field === "minimumBookingsRequired"
                ? value === ""
                  ? undefined
                  : Number(value)
                : field === "pricingStructure"
                ? value === "perPerson" ||
                  value === "perGroup" ||
                  value === "flatFee"
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
        ...(formData.tickets || []),
        {
          name: "",
          pricingStructure: "perPerson",
          basePrice: undefined,
          capacity: undefined,
          hasDiscount: false,
          discountType: "percentage",
          minimumBookingsRequired: undefined,
          soldCount: 0,
        },
      ],
    });
  };

  const removeTicket = (index: number) => {
    updateFormData({
      tickets: (formData.tickets || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {formData.pricingType === "free" ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-800 mb-2">
              Free Event
            </h4>
            <p className="text-xs text-green-700">
              Your event is free to attend. Set the maximum capacity for your
              free event.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Event Capacity</Label>
            <Input
              type="number"
              min="1"
              placeholder="Enter maximum number of attendees"
              value={formData.freeEventCapacity ?? ""}
              onChange={(e) =>
                handleInputChange(
                  "freeEventCapacity",
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors.freeEventCapacity && (
              <p className="text-xs text-red-600">{errors.freeEventCapacity}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-4">
            <h4 className="text-[13px] font-semibold text-blue-800 mb-1">
              Paid Event
            </h4>
            <p className="text-[12px] text-blue-700">
              Create ticket types with pricing. At least one ticket type is
              required for paid events.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Ticket Types</Label>
            <div className="space-y-4">
              {(formData.tickets || []).map((ticket, index) => (
                <div key={index} className="border p-4 rounded-md space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600 text-xs">Ticket Name</Label>
                    <Input
                      placeholder="e.g. Early Bird, VIP, General"
                      value={ticket.name}
                      onChange={(e) =>
                        handleTicketChange(index, "name", e.target.value)
                      }
                      className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    />
                    {errors[`tickets.${index}.name`] && (
                      <p className="text-xs text-red-600">
                        {errors[`tickets.${index}.name`]}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-600 text-xs">
                        Pricing Structure
                      </Label>
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
                            <SelectItem
                              key={type}
                              value={type}
                              className="text-xs cursor-pointer"
                            >
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
                      <Label className="text-gray-600 text-xs">
                        Base Price (NGN)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter price"
                        value={ticket.basePrice ?? ""}
                        onChange={(e) =>
                          handleTicketChange(index, "basePrice", e.target.value)
                        }
                        className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                      />
                      {errors[`tickets.${index}.basePrice`] && (
                        <p className="text-xs text-red-600">
                          {errors[`tickets.${index}.basePrice`]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-600 text-xs">Capacity</Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Enter capacity"
                        value={ticket.capacity ?? ""}
                        onChange={(e) =>
                          handleTicketChange(index, "capacity", e.target.value)
                        }
                        className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                      />
                      {errors[`tickets.${index}.capacity`] && (
                        <p className="text-xs text-red-600">
                          {errors[`tickets.${index}.capacity`]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600 text-xs">
                        Minimum Bookings Required (Optional)
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="e.g. 5"
                        value={ticket.minimumBookingsRequired ?? ""}
                        onChange={(e) =>
                          handleTicketChange(
                            index,
                            "minimumBookingsRequired",
                            e.target.value
                          )
                        }
                        className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                      />
                      {errors[`tickets.${index}.minimumBookingsRequired`] && (
                        <p className="text-xs text-red-600">
                          {errors[`tickets.${index}.minimumBookingsRequired`]}
                        </p>
                      )}
                    </div>
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
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h6 className="text-xs font-medium text-gray-700">
                        Discount Details
                      </h6>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-600 text-xs">
                            Discount Type
                          </Label>
                          <Select
                            value={ticket.discountType}
                            onValueChange={(value) =>
                              handleTicketChange(index, "discountType", value)
                            }
                          >
                            <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
                              <SelectValue placeholder="Select type" />
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
                          {errors[`tickets.${index}.discountType`] && (
                            <p className="text-xs text-red-600">
                              {errors[`tickets.${index}.discountType`]}
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
                            min="0"
                            step={
                              ticket.discountType === "percentage"
                                ? "1"
                                : "0.01"
                            }
                            max={
                              ticket.discountType === "percentage"
                                ? "100"
                                : undefined
                            }
                            placeholder={
                              ticket.discountType === "percentage"
                                ? "Enter %"
                                : "Enter amount"
                            }
                            value={ticket.discountValue ?? ""}
                            onChange={(e) =>
                              handleTicketChange(
                                index,
                                "discountValue",
                                e.target.value
                              )
                            }
                            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                          />
                          {errors[`tickets.${index}.discountValue`] && (
                            <p className="text-xs text-red-600">
                              {errors[`tickets.${index}.discountValue`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.pricingType === "paid" &&
                    (formData.tickets || []).length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeTicket(index)}
                        className="bg-red-100/80 text-red-600 text-xs hover:bg-red-100/90 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Ticket
                      </Button>
                    )}
                </div>
              ))}

              {formData.pricingType === "paid" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTicket}
                  className="bg-primary/10 text-primary text-xs border-none shadow-none hover:bg-primary/15 hover:text-primary cursor-pointer transition-colors ease-in-out duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ticket
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Step 5: Details & Media
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

  const handleArrayChange = (
    field: "requirements" | "tags" | "whatsIncluded",
    value: string,
    action: "add" | "remove"
  ) => {
    if (
      action === "add" &&
      value.trim() &&
      !formData[field]?.includes(value.trim())
    ) {
      updateFormData({ [field]: [...(formData[field] || []), value.trim()] });
    } else if (action === "remove") {
      updateFormData({
        [field]: (formData[field] || []).filter((item) => item !== value),
      });
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div>
          <Label className="text-gray-600 text-xs">Event Images</Label>
          <p className="text-[10px] text-gray-500 mt-1">
            At least 3 images are required ({formData.images?.length || 0}/3)
          </p>
        </div>
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
                <Trash2 className="h-3 w-3" />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">
            Age Restriction (optional)
          </Label>
          <Input
            type="number"
            min="0"
            max="100"
            placeholder="Enter minimum age"
            value={formData.ageRestriction ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              handleInputChange(
                "ageRestriction",
                value === "" ? undefined : Number(value)
              );
            }}
            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
          />
          {errors.ageRestriction && (
            <p className="text-xs text-red-600">{errors.ageRestriction}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Dress Code (optional)</Label>
          <Select
            value={formData.dressCode || ""}
            onValueChange={(value) => handleInputChange("dressCode", value)}
          >
            <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
              <SelectValue placeholder="Select dress code" />
            </SelectTrigger>
            <SelectContent>
              {DRESS_CODES.map((code) => (
                <SelectItem
                  key={code}
                  value={code}
                  className="text-gray-600 text-xs !py-2.5 cursor-pointer"
                >
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.dressCode && (
            <p className="text-xs text-red-600">{errors.dressCode}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-600 text-xs mb-2 block">
            What&apos;s Included
          </Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="e.g. Welcome drink, Lunch, Certificate"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleArrayChange(
                    "whatsIncluded",
                    e.currentTarget.value,
                    "add"
                  );
                  e.currentTarget.value = "";
                }
              }}
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                if (input.value) {
                  handleArrayChange("whatsIncluded", input.value, "add");
                  input.value = "";
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.whatsIncluded || []).map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-xs flex items-center gap-2"
              >
                {item}
                <button
                  type="button"
                  onClick={() =>
                    handleArrayChange("whatsIncluded", item, "remove")
                  }
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {errors.whatsIncluded && (
            <p className="text-xs text-red-600">{errors.whatsIncluded}</p>
          )}
        </div>

        <div>
          <Label className="text-gray-600 text-xs mb-2 block">
            Requirements
          </Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="e.g. Bring laptop, Valid ID required"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleArrayChange(
                    "requirements",
                    e.currentTarget.value,
                    "add"
                  );
                  e.currentTarget.value = "";
                }
              }}
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                if (input.value) {
                  handleArrayChange("requirements", input.value, "add");
                  input.value = "";
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.requirements || []).map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-xs flex items-center gap-2"
              >
                {item}
                <button
                  type="button"
                  onClick={() =>
                    handleArrayChange("requirements", item, "remove")
                  }
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {errors.requirements && (
            <p className="text-xs text-red-600">{errors.requirements}</p>
          )}
        </div>

        <div>
          <Label className="text-gray-600 text-xs mb-2 block">Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="e.g. networking, tech, startup"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleArrayChange("tags", e.currentTarget.value, "add");
                  e.currentTarget.value = "";
                }
              }}
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                if (input.value) {
                  handleArrayChange("tags", input.value, "add");
                  input.value = "";
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.tags || []).map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-xs flex items-center gap-2"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleArrayChange("tags", item, "remove")}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {errors.tags && <p className="text-xs text-red-600">{errors.tags}</p>}
        </div>
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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Children Policy</Label>
          <Select
            value={formData.childrenPolicy}
            onValueChange={(value) =>
              handleInputChange(
                "childrenPolicy",
                value as "allowed" | "notAllowed"
              )
            }
          >
            <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
              <SelectValue placeholder="Select children policy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allowed" className="text-xs cursor-pointer">
                Children Allowed
              </SelectItem>
              <SelectItem value="notAllowed" className="text-xs cursor-pointer">
                Children Not Allowed
              </SelectItem>
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
              handleInputChange("petPolicy", value as "allowed" | "notAllowed")
            }
          >
            <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
              <SelectValue placeholder="Select pet policy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allowed" className="text-xs cursor-pointer">
                Pets Allowed
              </SelectItem>
              <SelectItem value="notAllowed" className="text-xs cursor-pointer">
                Pets Not Allowed
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.petPolicy && (
            <p className="text-xs text-red-600">{errors.petPolicy}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Smoking Policy</Label>
          <Select
            value={formData.smokingPolicy}
            onValueChange={(value) =>
              handleInputChange(
                "smokingPolicy",
                value as "allowed" | "notAllowed"
              )
            }
          >
            <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
              <SelectValue placeholder="Select smoking policy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allowed" className="text-xs cursor-pointer">
                Smoking Allowed
              </SelectItem>
              <SelectItem value="notAllowed" className="text-xs cursor-pointer">
                Smoking Not Allowed
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.smokingPolicy && (
            <p className="text-xs text-red-600">{errors.smokingPolicy}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function EventsListingForm({ event }: { event?: EventListing }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState<StepKey>(1);
  
  // Prevent zoom on mobile when focusing inputs
  usePreventZoomAggressive();
  const [formData, setFormData] = useState<FormData>({
    title: event?.title || "",
    description: event?.description || "",
    summary: "",
    category: event?.category || "",
    eventType: event?.eventType || "",
    format: event?.format === "virtual" ? "virtual" : "in-person",
    pricingType: event?.pricingType || "paid",
    freeEventCapacity: (event as EventListing & { freeEventCapacity?: number })?.freeEventCapacity || undefined,
    startDate: event?.startDate
      ? moment(event.startDate).format("YYYY-MM-DD")
      : "",
    startTime: event?.startDate ? moment(event.startDate).format("HH:mm") : "",
    endDate: event?.endDate ? moment(event.endDate).format("YYYY-MM-DD") : "",
    endTime: event?.endDate ? moment(event.endDate).format("HH:mm") : "",
    venueName: "",
    country: "",
    state: "",
    city: "",
    zipcode: "",
    streetAddress: "",
    virtualPlatform: "",
    virtualMeetingLink: "",
    virtualMeetingId: "",
    virtualAccessInstructions: "",
    virtualCapacity: undefined,
    tickets:
      (event?.pricingType || "paid") === "paid"
        ? [
            {
              name: "",
              pricingStructure: "perPerson",
              basePrice: undefined,
              capacity: undefined,
              hasDiscount: false,
              discountType: "percentage",
              minimumBookingsRequired: undefined,
              soldCount: 0,
            },
          ]
        : [],
    images: event?.images || [],
    ageRestriction: event?.ageRestriction || undefined,
    requirements: event?.requirements || [],
    tags: event?.tags || [],
    dressCode: event?.dressCode || "",
    whatsIncluded: event?.whatsIncluded || [],
    childrenPolicy: "allowed",
    petPolicy: "notAllowed",
    smokingPolicy: "notAllowed",
  });
  const [errors, setErrors] = useState<Errors>({});

  // API hooks
  const { mutate: createVendorEvent, isPending: creatingVendorEvent } =
    useCreateEventListing();
  const { mutate: createAdminEvent, isPending: creatingAdminEvent } =
    useCreateAdminEventListing();

  const isAdminPath = pathname.startsWith("/admin");
  const createEvent = isAdminPath ? createAdminEvent : createVendorEvent;
  const isPending = isAdminPath ? creatingAdminEvent : creatingVendorEvent;
  const isEditMode = !!event?._id;

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...data };

      // If pricing type changes to "paid" and no tickets exist, add a default ticket
      if (
        data.pricingType === "paid" &&
        (!newData.tickets || newData.tickets.length === 0)
      ) {
        newData.tickets = [
          {
            name: "",
            pricingStructure: "perPerson",
            basePrice: undefined,
            capacity: undefined,
            hasDiscount: false,
            discountType: "percentage",
            minimumBookingsRequired: undefined,
            soldCount: 0,
          },
        ];
      }

      // If pricing type changes to "free", clear tickets
      if (data.pricingType === "free") {
        newData.tickets = [];
      }

      return newData;
    });
  };

  const validateStep = (step: number): boolean => {
    const stepSchemas: Record<number, z.ZodSchema> = {
      1: z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        summary: z.string().min(1, "Summary is required"),
        category: z.string().min(1, "Category is required"),
        eventType: z.string().min(1, "Event type is required"),
        format: z.enum(["in-person", "virtual"]),
        pricingType: z.enum(["free", "paid"]),
      }),
      2: z.object({
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().min(1, "End date is required"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
      }),
      3: z
        .object({
          venueName: z.string().optional(),
          country: z.string().optional(),
          state: z.string().optional(),
          city: z.string().optional(),
          zipcode: z.string().optional(),
          streetAddress: z.string().optional(),
          virtualPlatform: z.string().optional(),
          virtualMeetingLink: z.string().optional(),
          virtualMeetingId: z.string().optional(),
          virtualAccessInstructions: z.string().optional(),
          virtualCapacity: z.number().optional(),
          format: z.enum(["in-person", "virtual"]),
        })
        .refine(
          (data) => {
            if (data.format === "in-person") {
              return data.venueName && data.venueName.trim().length > 0;
            }
            return true;
          },
          {
            message: "Venue name is required for in-person events",
            path: ["venueName"],
          }
        )
        .refine(
          (data) => {
            if (data.format === "in-person") {
              return data.country && data.country.trim().length > 0;
            }
            return true;
          },
          {
            message: "Country is required for in-person events",
            path: ["country"],
          }
        )
        .refine(
          (data) => {
            if (data.format === "in-person") {
              return data.state && data.state.trim().length > 0;
            }
            return true;
          },
          {
            message: "State is required for in-person events",
            path: ["state"],
          }
        )
        .refine(
          (data) => {
            if (data.format === "in-person") {
              return data.city && data.city.trim().length > 0;
            }
            return true;
          },
          {
            message: "City is required for in-person events",
            path: ["city"],
          }
        )
        .refine(
          (data) => {
            if (data.format === "in-person") {
              return data.streetAddress && data.streetAddress.trim().length > 0;
            }
            return true;
          },
          {
            message: "Street address is required for in-person events",
            path: ["streetAddress"],
          }
        )
        .refine(
          (data) => {
            if (data.format === "virtual") {
              return (
                data.virtualPlatform && data.virtualPlatform.trim().length > 0
              );
            }
            return true;
          },
          {
            message: "Virtual platform is required for virtual events",
            path: ["virtualPlatform"],
          }
        )
        .refine(
          (data) => {
            if (data.format === "virtual") {
              return data.virtualCapacity && data.virtualCapacity > 0;
            }
            return true;
          },
          {
            message: "Virtual capacity is required for virtual events",
            path: ["virtualCapacity"],
          }
        ),
      4: z
        .object({
          tickets: z.array(TicketSchema).optional(),
          pricingType: z.enum(["free", "paid"]),
          freeEventCapacity: z
            .number()
            .min(1, "Free event capacity is required for free events")
            .optional(),
        })
        .refine(
          (data) => {
            if (data.pricingType === "free") {
              return data.freeEventCapacity && data.freeEventCapacity > 0;
            }
            return true;
          },
          {
            message: "Free event capacity is required for free events",
            path: ["freeEventCapacity"],
          }
        )
        .refine(
          (data) => {
            if (data.pricingType === "paid") {
              return data.tickets && data.tickets.length > 0;
            }
            return true;
          },
          {
            message: "At least one ticket is required for paid events",
            path: ["tickets"],
          }
        ),
      5: z.object({
        images: z
          .array(z.string().url({ message: "Each image must be a valid URL" }))
          .min(3, { message: "At least 3 images are required" }),
        ageRestriction: z.number().min(0).max(100).optional(),
        dressCode: z.string().optional(),
        whatsIncluded: z.array(z.string()).optional(),
        requirements: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
      }),
      6: z.object({
        childrenPolicy: z.enum(["allowed", "notAllowed"]).optional(),
        petPolicy: z.enum(["allowed", "notAllowed"]).optional(),
        smokingPolicy: z.enum(["allowed", "notAllowed"]).optional(),
      }),
    };

    const schema = stepSchemas[step];
    if (!schema) return true;

    const result = schema.safeParse(formData);
    if (!result.success) {
      const newErrors: Errors = {};
      result.error.errors.forEach((error) => {
        const field = error.path.join(".");
        newErrors[field as keyof Errors] = error.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      // Additional check for Step 5 - require at least 3 images
      if (
        currentStep === 5 &&
        (!formData.images || formData.images.length < 3)
      ) {
        setErrors({ images: "At least 3 images are required" });
        return;
      }

      setCurrentStep((prev) =>
        prev < STEPS.length ? ((prev + 1) as StepKey) : prev
      );
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as StepKey) : prev));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      // Transform tickets to match CreateTicketType interface (only for paid events)
      const transformedTickets =
        formData.pricingType === "paid"
          ? formData.tickets
              ?.filter(
                (ticket) =>
                  ticket.basePrice !== undefined &&
                  ticket.capacity !== undefined
              )
              .map((ticket): CreateTicketType => ({
                name: ticket.name,
                basePrice: ticket.basePrice!,
                pricingStructure: ticket.pricingStructure,
                capacity: ticket.capacity!,
                soldCount: ticket.soldCount || 0,
                hasDiscount: ticket.hasDiscount || false,
                discountType: ticket.hasDiscount ? (ticket.discountType || "percentage") : undefined,
                discountValue: ticket.hasDiscount ? (ticket.discountValue || 0) : undefined,
                minimumBookingsRequired: ticket.minimumBookingsRequired,
              }))
          : undefined;

      // Clean the data before sending - set unused fields to null/undefined
      const cleanedFormData = { ...formData };
      
      // Convert empty strings to undefined for better validation
      const stringFields = [
        'venueName', 'country', 'state', 'city', 'zipcode', 'streetAddress',
        'virtualPlatform', 'virtualMeetingLink', 'virtualMeetingId', 'virtualAccessInstructions'
      ];
      
      stringFields.forEach(field => {
        if (cleanedFormData[field as keyof typeof cleanedFormData] === '') {
          (cleanedFormData as Record<string, unknown>)[field] = undefined;
        }
      });
      
      // Handle format-specific field cleaning
      if (formData.format === "in-person") {
        // For in-person events, clear virtual fields
        cleanedFormData.virtualPlatform = undefined;
        cleanedFormData.virtualMeetingLink = undefined;
        cleanedFormData.virtualMeetingId = undefined;
        cleanedFormData.virtualAccessInstructions = undefined;
        cleanedFormData.virtualCapacity = undefined;
      } else if (formData.format === "virtual") {
        // For virtual events, clear venue fields
        cleanedFormData.venueName = undefined;
        cleanedFormData.country = undefined;
        cleanedFormData.state = undefined;
        cleanedFormData.city = undefined;
        cleanedFormData.zipcode = undefined;
        cleanedFormData.streetAddress = undefined;
      }
      
      // Handle pricing type-specific field cleaning
      if (formData.pricingType === "free") {
        // For free events, clear tickets and ensure freeEventCapacity is set
        cleanedFormData.tickets = undefined;
        // freeEventCapacity should already be set from form data
      } else if (formData.pricingType === "paid") {
        // For paid events, clear freeEventCapacity
        cleanedFormData.freeEventCapacity = undefined;
      }

      const eventData = {
        ...cleanedFormData,
        startDate: new Date(`${formData.startDate}T${formData.startTime}`),
        endDate: new Date(`${formData.endDate}T${formData.endTime}`),
        tickets: transformedTickets, // This will be undefined for free events, array for paid events
        images: formData.images,
      };

      if (isEditMode && event?._id) {
        // Update existing event
        // await updateEventListing({ id: event._id, data: eventData });
      } else {
        // Create new event
        createEvent(eventData, {
          onSuccess: () => {
            if (pathname.startsWith("/admin")) {
              router.push("/admin/events");
            } else {
              router.push("/vendor/events");
            }
          },
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="h-full flex flex-col event-form">
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-primary text-lg md:text-xl font-semibold">
            {isEditMode ? "Edit Event" : "New Event"}
          </h1>
          <p className="text-gray-600 text-[11px] md:text-xs mt-0.5 md:mt-1">
            {isEditMode
              ? "Edit your event listing"
              : "Create your event listing"}
          </p>
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
                className={index < STEPS.length - 1 ? "mb-8 xl:mb-10 ms-6" : "ms-6"}
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
                <form className="space-y-6">
                  {currentStep === 1 && (
                    <Step1Form
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                      setErrors={setErrors}
                    />
                  )}
                  {currentStep === 2 && (
                    <Step2Form
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                      setErrors={setErrors}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3Form
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                      setErrors={setErrors}
                    />
                  )}
                  {currentStep === 4 && (
                    <Step4Form
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                      setErrors={setErrors}
                    />
                  )}
                  {currentStep === 5 && (
                    <Step5Form
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                      setErrors={setErrors}
                    />
                  )}
                  {currentStep === 6 && (
                    <Step6Form
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                      setErrors={setErrors}
                    />
                  )}
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
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs"
                  disabled={isPending}
                >
                  {isPending ? "Creating Event..." : "Create Event"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}