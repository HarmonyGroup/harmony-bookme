"use client";

import React, { useState, useRef } from "react";
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
import {
  AMENITIES,
  AMENITY_CATEGORIES,
  PROPERTY_TYPES,
} from "@/constants/accommodation-amenities";
import { useCreateAccommodationListing, useUpdateAccommodation } from "@/services/vendor/accommodation";
import type { CreateAccommodationListingRequest, AccommodationListing } from "@/types/accommodation";
import { toast } from "sonner";
import { useUploadImage } from "@/services/shared/image-upload";
import Image from "next/image";
import { usePreventZoomAggressive } from "@/hooks/use-prevent-zoom-aggressive";

const BaseFormSchema = z.object({
  // Step 1: Basic Information
  title: z
    .string()
    .min(2, "Accommodation title must be at least 2 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  accommodationType: z.enum(["shortlet", "hotel"], {
    message: "Please select either Shortlet or Hotel.",
  }),
  buildingType: z.string().optional(),
  propertySize: z.string().optional(),
  bedrooms: z
    .number()
    .min(0, "Number of bedrooms must be 0 or more.")
    .optional()
    .or(z.literal(undefined)),
  bathrooms: z
    .number()
    .min(0, "Number of bathrooms must be 0 or more.")
    .optional()
    .or(z.literal(undefined)),
  parkingSpaces: z
    .number()
    .min(0, "Number of parking spaces must be 0 or more.")
    .optional()
    .or(z.literal(undefined)),
  maxGuests: z
    .number()
    .min(1, "Maximum guests must be at least 1.")
    .optional()
    .or(z.literal(undefined)),

  // Step 2: Location & Access
  country: z.string().min(1, "Please select a country."),
  state: z.string().min(1, "State/Province is required."),
  city: z.string().min(1, "City is required."),
  streetAddress: z.string().min(1, "Street address is required."),
  zipCode: z.string().optional(),
  checkInTime: z.string().min(1, "Check-in time is required."),
  checkOutTime: z.string().min(1, "Check-out time is required."),

  // Step 3: Amenities
  amenities: z.record(z.string(), z.boolean()).optional(),

  // Step 4: Pricing
  basePrice: z.number().min(1, "Base price must be greater than 0.").optional(),
  hasDiscount: z.boolean().optional(),
  discountType: z.enum(["fixed", "percentage"]).optional(),
  discountValue: z
    .number()
    .min(0, "Discount value must be positive")
    .optional(),
  rooms: z
    .array(
      z.object({
        name: z.string().min(1, "Room name is required"),
        availableRooms: z
          .number()
          .min(1, "Available rooms must be at least 1")
          .optional()
          .or(z.literal(undefined)),
        basePrice: z
          .number()
          .min(1, "Base price must be greater than 0")
          .optional()
          .or(z.literal(undefined)),
        hasDiscount: z.boolean().optional(),
        discountType: z.enum(["fixed", "percentage"]).optional(),
        discountValue: z
          .number()
          .min(0, "Discount value must be positive")
          .optional(),
      })
    )
    .optional(),

  // Step 5: Details and Media
  images: z.array(z.string().url()).min(1, "At least one image is required."),
  tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
  whatsIncluded: z
    .array(z.string().min(1, "Inclusion cannot be empty"))
    .optional(),

  // Step 6: Policies
  smokingPolicy: z.enum(["allowed", "notAllowed"]),
  petPolicy: z.enum(["allowed", "notAllowed"]),
  childrenPolicy: z.enum(["allowed", "notAllowed"]),
  houseRules: z.string().optional(),
});

const FormSchema = BaseFormSchema.refine(
  (data) =>
    !data.hasDiscount ||
    (data.discountType !== undefined && data.discountValue !== undefined),
  {
    message: "Discount type and value are required when discount is enabled",
    path: ["discountType"],
  }
).refine(
  (data) =>
    !data.rooms ||
    data.rooms.every(
      (room) =>
        !room.hasDiscount ||
        (room.discountType !== undefined && room.discountValue !== undefined)
    ),
  {
    message:
      "Discount type and value are required when discount is enabled for rooms",
    path: ["rooms"],
  }
);

// Types for form data
type FormData = z.infer<typeof FormSchema>;
type Errors = Record<string, string>;
type StepKey = 1 | 2 | 3 | 4 | 5 | 6;

const STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Accommodation details",
  },
  {
    id: 2,
    title: "Location & Access",
    description: "Address and check-in details",
  },
  { id: 3, title: "Amenities", description: "Features and facilities" },
  { id: 4, title: "Pricing", description: "Rates and fees" },
  {
    id: 5,
    title: "Details and Media",
    description: "Images, tags, and additional details",
  },
  { id: 6, title: "Policies", description: "Rules and restrictions" },
];

// Step component interfaces
interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors: Errors;
  setErrors: (errors: Errors) => void;
}

// Step 1: Basic Information
const Step1Form: React.FC<StepProps> = ({
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
        <Label className="text-gray-600 text-xs">Accommodation Title</Label>
        <Input
          placeholder="e.g. Luxury Apartments"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Description</Label>
        <Textarea
          placeholder="Tell us more about this accommodation"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="!py-3 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 min-h-40"
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Accommodation Type</Label>
        <Select
          value={formData.accommodationType}
          onValueChange={(value) => {
            handleInputChange(
              "accommodationType",
              value as "shortlet" | "hotel"
            );
            // Reset fields when switching accommodation types
            if (value === "hotel") {
              handleInputChange("buildingType", "");
              handleInputChange("maxGuests", undefined);
              handleInputChange("basePrice", undefined);
              handleInputChange("hasDiscount", false);
              handleInputChange("discountType", undefined);
              handleInputChange("discountValue", undefined);
              handleInputChange("rooms", []);
            } else if (value === "shortlet") {
              handleInputChange("rooms", []);
              handleInputChange("basePrice", undefined);
              handleInputChange("hasDiscount", false);
              handleInputChange("discountType", undefined);
              handleInputChange("discountValue", undefined);
            }
          }}
        >
          <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
            <SelectValue placeholder="Select accommodation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="shortlet"
              className="text-gray-600 text-xs !py-2.5 cursor-pointer"
            >
              Shortlet
            </SelectItem>
            <SelectItem
              value="hotel"
              className="text-gray-600 text-xs !py-2.5 cursor-pointer"
            >
              Hotel
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.accommodationType && (
          <p className="text-xs text-red-600">{errors.accommodationType}</p>
        )}
      </div>

      {formData.accommodationType === "shortlet" && (
        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Building Type *</Label>
          <Select
            value={formData.buildingType}
            onValueChange={(value) => handleInputChange("buildingType", value)}
          >
            <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
              <SelectValue placeholder="Select a building type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
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
          {errors.buildingType && (
            <p className="text-xs text-red-600">{errors.buildingType}</p>
          )}
        </div>
      )}

      {formData.accommodationType === "shortlet" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-600 text-xs">Bedrooms *</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.bedrooms ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange(
                    "bedrooms",
                    value === ""
                      ? undefined
                      : Number.parseInt(value) || undefined
                  );
                }}
                className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
              />
              {errors.bedrooms && (
                <p className="text-xs text-red-600">{errors.bedrooms}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 text-xs">Bathrooms *</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.bathrooms ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange(
                    "bathrooms",
                    value === ""
                      ? undefined
                      : Number.parseInt(value) || undefined
                  );
                }}
                className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
              />
              {errors.bathrooms && (
                <p className="text-xs text-red-600">{errors.bathrooms}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">
              Property Size (optional)
            </Label>
            <Input
              placeholder="e.g. 1200 sq ft"
              value={formData.propertySize}
              onChange={(e) =>
                handleInputChange("propertySize", e.target.value)
              }
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors.propertySize && (
              <p className="text-xs text-red-600">{errors.propertySize}</p>
            )}
          </div>
        </>
      )}

      {formData.accommodationType === "shortlet" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Maximum Guests *</Label>
            <Input
              type="number"
              min={1}
              placeholder="1"
              value={formData.maxGuests ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange(
                  "maxGuests",
                  value === "" ? undefined : Number.parseInt(value) || undefined
                );
              }}
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors.maxGuests && (
              <p className="text-xs text-red-600">{errors.maxGuests}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">Parking Spaces</Label>
            <Input
              type="number"
              placeholder="0"
              value={formData.parkingSpaces ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange(
                  "parkingSpaces",
                  value === "" ? undefined : Number.parseInt(value) || undefined
                );
              }}
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors.parkingSpaces && (
              <p className="text-xs text-red-600">{errors.parkingSpaces}</p>
            )}
          </div>
        </div>
      )}

      {formData.accommodationType === "hotel" && (
        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Parking Spaces</Label>
          <Input
            type="number"
            placeholder="0"
            value={formData.parkingSpaces ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              handleInputChange(
                "parkingSpaces",
                value === "" ? undefined : Number.parseInt(value) || undefined
              );
            }}
            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
          />
          {errors.parkingSpaces && (
            <p className="text-xs text-red-600">{errors.parkingSpaces}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Step 2: Location & Access
const Step2Form: React.FC<StepProps> = ({
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
        <Label className="text-gray-600 text-xs">Country</Label>
        <Input
          placeholder="e.g. Nigeria"
          value={formData.country}
          onChange={(e) => handleInputChange("country", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.country && (
          <p className="text-xs text-red-600">{errors.country}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">State</Label>
          <Input
            placeholder="e.g. Lagos"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
          />
          {errors.state && (
            <p className="text-xs text-red-600">{errors.state}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">City</Label>
          <Input
            placeholder="e.g. Victoria Island"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
          />
          {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Street Address</Label>
        <Input
          placeholder="e.g. 123 Main Street"
          value={formData.streetAddress}
          onChange={(e) => handleInputChange("streetAddress", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.streetAddress && (
          <p className="text-xs text-red-600">{errors.streetAddress}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">
          ZIP/Postal Code (optional)
        </Label>
        <Input
          placeholder="e.g. 10001"
          value={formData.zipCode}
          onChange={(e) => handleInputChange("zipCode", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.zipCode && (
          <p className="text-xs text-red-600">{errors.zipCode}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Check-in Time</Label>
          <Input
            type="time"
            value={formData.checkInTime}
            onChange={(e) => handleInputChange("checkInTime", e.target.value)}
            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
          />
          {errors.checkInTime && (
            <p className="text-xs text-red-600">{errors.checkInTime}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 text-xs">Check-out Time</Label>
          <Input
            type="time"
            value={formData.checkOutTime}
            onChange={(e) => handleInputChange("checkOutTime", e.target.value)}
            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
          />
          {errors.checkOutTime && (
            <p className="text-xs text-red-600">{errors.checkOutTime}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Step 3: Amenities
const Step3Form: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
}) => {
  const handleAmenityChange = (amenityKey: string, checked: boolean) => {
    const currentAmenities = formData.amenities || {};
    updateFormData({
      amenities: {
        ...currentAmenities,
        [amenityKey]: checked,
      },
    });
    setErrors({ ...errors, amenities: "" });
  };

  return (
    <div className="space-y-8">
      {Object.entries(AMENITY_CATEGORIES).map(
        ([categoryKey, categoryLabel]) => {
          const categoryAmenities = AMENITIES.filter(
            (amenity) => amenity.category === categoryKey
          );

          return (
            <div key={categoryKey} className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">
                {categoryLabel}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categoryAmenities.map((amenity) => (
                  <div
                    key={amenity.key}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      checked={formData.amenities?.[amenity.key] || false}
                      onCheckedChange={(checked) =>
                        handleAmenityChange(amenity.key, !!checked)
                      }
                    />
                    <Label className="text-xs text-gray-600 cursor-pointer">
                      {amenity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

// Step 4: Pricing
const Step4Form: React.FC<StepProps> = ({
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

  const handleRoomChange = (index: number, field: string, value: unknown) => {
    const updatedRooms = [...(formData.rooms || [])];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };

    // Clear discount fields when hasDiscount is false
    if (field === "hasDiscount" && !value) {
      updatedRooms[index] = {
        ...updatedRooms[index],
        discountType: undefined,
        discountValue: undefined,
      };
    }

    updateFormData({ rooms: updatedRooms });
    setErrors({ ...errors, [`rooms.${index}.${field}`]: "" });
  };

  const addRoom = () => {
    const newRoom = {
      name: "",
      availableRooms: undefined,
      basePrice: undefined,
      hasDiscount: false,
      discountType: undefined as "fixed" | "percentage" | undefined,
      discountValue: undefined,
    };
    updateFormData({ rooms: [...(formData.rooms || []), newRoom] });
  };

  const removeRoom = (index: number) => {
    const updatedRooms = (formData.rooms || []).filter((_, i) => i !== index);
    updateFormData({ rooms: updatedRooms });
  };

  return (
    <div className="space-y-6">
      {formData.accommodationType === "shortlet" ? (
        // Shortlet Pricing
        <>
          <div className="space-y-2">
            <Label className="text-gray-600 text-xs">
              Base Price per Night *
            </Label>
            <Input
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              value={formData.basePrice ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange(
                  "basePrice",
                  value === ""
                    ? undefined
                    : Number.parseFloat(value) || undefined
                );
              }}
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors.basePrice && (
              <p className="text-xs text-red-600">{errors.basePrice}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDiscount"
                checked={formData.hasDiscount}
                onCheckedChange={(checked) => {
                  handleInputChange("hasDiscount", !!checked);
                  if (!checked) {
                    handleInputChange("discountType", undefined);
                    handleInputChange("discountValue", undefined);
                  }
                }}
                className="cursor-pointer"
              />
              <Label
                htmlFor="hasDiscount"
                className="text-xs text-gray-600 cursor-pointer"
              >
                Apply Discount
              </Label>
            </div>
          </div>

          {formData.hasDiscount && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h6 className="text-xs font-medium text-gray-700">
                Discount Details
              </h6>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-600 text-xs">Discount Type</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) =>
                      handleInputChange(
                        "discountType",
                        value as "fixed" | "percentage"
                      )
                    }
                  >
                    <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="fixed"
                        className="text-gray-600 text-xs !py-2.5 cursor-pointer"
                      >
                        Fixed Amount
                      </SelectItem>
                      <SelectItem
                        value="percentage"
                        className="text-gray-600 text-xs !py-2.5 cursor-pointer"
                      >
                        Percentage
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.discountType && (
                    <p className="text-xs text-red-600">
                      {errors.discountType}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600 text-xs">
                    Discount{" "}
                    {formData.discountType === "percentage"
                      ? "Percentage"
                      : "Amount"}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step={formData.discountType === "percentage" ? "1" : "0.01"}
                    max={
                      formData.discountType === "percentage" ? "100" : undefined
                    }
                    placeholder={
                      formData.discountType === "percentage" ? "0" : "0.00"
                    }
                    value={formData.discountValue ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange(
                        "discountValue",
                        value === ""
                          ? undefined
                          : Number.parseFloat(value) || undefined
                      );
                    }}
                    className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                  />
                  {errors.discountValue && (
                    <p className="text-xs text-red-600">
                      {errors.discountValue}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        // Hotel Pricing
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Room Types</h4>
              <Button
                type="button"
                onClick={addRoom}
                className="text-xs"
                variant="outline"
              >
                Add Room
              </Button>
            </div>

            {(formData.rooms || []).map((room, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-medium text-gray-600">
                    Room {index + 1}
                  </h5>
                  {(formData.rooms || []).length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeRoom(index)}
                      className="text-xs"
                      variant="outline"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600 text-xs">Room Name *</Label>
                    <Input
                      placeholder="e.g. Standard Room"
                      value={room.name}
                      onChange={(e) =>
                        handleRoomChange(index, "name", e.target.value)
                      }
                      className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    />
                    {errors[`rooms.${index}.name`] && (
                      <p className="text-xs text-red-600">
                        {errors[`rooms.${index}.name`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600 text-xs">
                      Available Rooms *
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="0"
                      value={room.availableRooms ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleRoomChange(
                          index,
                          "availableRooms",
                          value === ""
                            ? undefined
                            : Number.parseInt(value) || undefined
                        );
                      }}
                      className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                    />
                    {errors[`rooms.${index}.availableRooms`] && (
                      <p className="text-xs text-red-600">
                        {errors[`rooms.${index}.availableRooms`]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600 text-xs">
                    Base Price per Night *
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={room.basePrice ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleRoomChange(
                        index,
                        "basePrice",
                        value === ""
                          ? undefined
                          : Number.parseFloat(value) || undefined
                      );
                    }}
                    className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                  />
                  {errors[`rooms.${index}.basePrice`] && (
                    <p className="text-xs text-red-600">
                      {errors[`rooms.${index}.basePrice`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`hasDiscount-${index}`}
                      checked={room.hasDiscount}
                      onCheckedChange={(checked) =>
                        handleRoomChange(index, "hasDiscount", !!checked)
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

                {room.hasDiscount && (
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
                          value={room.discountType}
                          onValueChange={(value) =>
                            handleRoomChange(
                              index,
                              "discountType",
                              value as "fixed" | "percentage"
                            )
                          }
                        >
                          <SelectTrigger className="w-full text-xs shadow-none !py-6 cursor-pointer">
                            <SelectValue placeholder="Select discount type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="fixed"
                              className="text-gray-600 text-xs !py-2.5 cursor-pointer"
                            >
                              Fixed Amount
                            </SelectItem>
                            <SelectItem
                              value="percentage"
                              className="text-gray-600 text-xs !py-2.5 cursor-pointer"
                            >
                              Percentage
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors[`rooms.${index}.discountType`] && (
                          <p className="text-xs text-red-600">
                            {errors[`rooms.${index}.discountType`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-600 text-xs">
                          Discount{" "}
                          {room.discountType === "percentage"
                            ? "Percentage"
                            : "Amount"}
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step={
                            room.discountType === "percentage" ? "1" : "0.01"
                          }
                          max={
                            room.discountType === "percentage"
                              ? "100"
                              : undefined
                          }
                          placeholder={
                            room.discountType === "percentage" ? "0" : "0.00"
                          }
                          value={room.discountValue ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleRoomChange(
                              index,
                              "discountValue",
                              value === ""
                                ? undefined
                                : Number.parseFloat(value) || undefined
                            );
                          }}
                          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                        />
                        {errors[`rooms.${index}.discountValue`] && (
                          <p className="text-xs text-red-600">
                            {errors[`rooms.${index}.discountValue`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {(!formData.rooms || formData.rooms.length === 0) && (
              <div className="text-center py-8 text-gray-500 text-xs">
                No rooms added yet. Click &quot;Add Room&quot; to get started.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Step 5: Details and Media
const Step5Form: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(formData.images || []);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const { mutateAsync: uploadImage } = useUploadImage();

  // const handleInputChange = <K extends keyof FormData>(
  //   field: K,
  //   value: FormData[K]
  // ) => {
  //   updateFormData({ [field]: value });
  //   setErrors({ ...errors, [field]: "" });
  // };

  const handleArrayChange = (
    field: "tags" | "whatsIncluded",
    value: string,
    action: "add" | "remove"
  ) => {
    const currentArray = formData[field] || [];
    if (
      action === "add" &&
      value.trim() &&
      !currentArray.includes(value.trim())
    ) {
      updateFormData({ [field]: [...currentArray, value.trim()] });
    } else if (action === "remove") {
      updateFormData({
        [field]: currentArray.filter((item) => item !== value),
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
        `Failed to upload images: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mx-auto h-6 w-6 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
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
                className="w-full h-full object-cover rounded-lg"
                width={176}
                height={176}
                priority
              />
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-white text-[11px] px-2 py-1 rounded cursor-default">
                  Cover photo
                </div>
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
        <Label className="text-gray-600 text-xs">Tags (optional)</Label>
        <div className="flex flex-wrap gap-2">
          {(formData.tags || []).map((tag, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded cursor-pointer"
              onClick={() => handleArrayChange("tags", tag, "remove")}
            >
              {tag} <span className="ml-1">×</span>
            </div>
          ))}
        </div>
        <Input
          placeholder="Add a tag (e.g. luxury)"
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
        <Label className="text-gray-600 text-xs">
          What&apos;s Included (optional)
        </Label>
        <div className="flex flex-wrap gap-2">
          {(formData.whatsIncluded || []).map((item, index) => (
            <div
              key={index}
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded cursor-pointer"
              onClick={() => handleArrayChange("whatsIncluded", item, "remove")}
            >
              {item} <span className="ml-1">×</span>
            </div>
          ))}
        </div>
        <Input
          placeholder="Add an inclusion (e.g. Free WiFi)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleArrayChange("whatsIncluded", e.currentTarget.value, "add");
              e.currentTarget.value = "";
            }
          }}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.whatsIncluded && (
          <p className="text-xs text-red-600">{errors.whatsIncluded}</p>
        )}
      </div>
    </div>
  );
};

// Step 6: Policies
const Step6Form: React.FC<StepProps> = ({
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
            <SelectItem
              value="allowed"
              className="text-gray-600 text-xs !py-2.5 cursor-pointer"
            >
              Smoking Allowed
            </SelectItem>
            <SelectItem
              value="notAllowed"
              className="text-gray-600 text-xs !py-2.5 cursor-pointer"
            >
              Smoking Not Allowed
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.smokingPolicy && (
          <p className="text-xs text-red-600">{errors.smokingPolicy}</p>
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
            <SelectItem
              value="allowed"
              className="text-gray-600 text-xs !py-2.5 cursor-pointer"
            >
              Pets Allowed
            </SelectItem>
            <SelectItem
              value="notAllowed"
              className="text-gray-600 text-xs !py-2.5 cursor-pointer"
            >
              Pets Not Allowed
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.petPolicy && (
          <p className="text-xs text-red-600">{errors.petPolicy}</p>
        )}
      </div>

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
            <SelectItem
              value="allowed"
              className="text-gray-600 text-xs !py-2.5 cursor-pointer"
            >
              Children Allowed
            </SelectItem>
            <SelectItem
              value="notAllowed"
              className="text-gray-600 text-xs !py-2.5 cursor-pointer"
            >
              Children Not Allowed
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.childrenPolicy && (
          <p className="text-xs text-red-600">{errors.childrenPolicy}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">House Rules (optional)</Label>
        <Textarea
          placeholder="e.g. No parties or events, Quiet hours from 10 PM to 8 AM, No shoes inside..."
          value={formData.houseRules}
          onChange={(e) => handleInputChange("houseRules", e.target.value)}
          className="!py-3 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 min-h-32"
        />
        {errors.houseRules && (
          <p className="text-xs text-red-600">{errors.houseRules}</p>
        )}
      </div>
    </div>
  );
};

// Main AccommodationListingForm component
const AccommodationListingForm: React.FC<{ accommodation?: AccommodationListing }> = ({ accommodation }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepKey>(1);

  // Prevent zoom on mobile when focusing inputs
  usePreventZoomAggressive();
  const [formData, setFormData] = useState<FormData>({
    title: accommodation?.title || "",
    description: accommodation?.description || "",
    accommodationType: accommodation?.accommodationType || "shortlet",
    buildingType: accommodation?.buildingType || "",
    propertySize: accommodation?.propertySize || "",
    bedrooms: accommodation?.bedrooms,
    bathrooms: accommodation?.bathrooms,
    parkingSpaces: accommodation?.parkingSpaces,
    maxGuests: accommodation?.maxGuests,
    country: accommodation?.country || "",
    state: accommodation?.state || "",
    city: accommodation?.city || "",
    streetAddress: accommodation?.streetAddress || "",
    zipCode: accommodation?.zipCode || "",
    checkInTime: accommodation?.checkInTime || "",
    checkOutTime: accommodation?.checkOutTime || "",
    basePrice: accommodation?.basePrice,
    hasDiscount: accommodation?.hasDiscount || false,
    discountType: accommodation?.discountType,
    discountValue: accommodation?.discountValue,
    rooms: accommodation?.rooms || [],
    images: accommodation?.images || [],
    tags: accommodation?.tags || [],
    whatsIncluded: accommodation?.whatsIncluded || [],
    smokingPolicy: accommodation?.smokingPolicy || "notAllowed",
    petPolicy: accommodation?.petPolicy || "notAllowed",
    childrenPolicy: accommodation?.childrenPolicy || "allowed",
    amenities: accommodation?.amenities || {},
    houseRules: accommodation?.houseRules || "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const { mutate: createAccommodation, isPending: creatingAccommodation } =
    useCreateAccommodationListing();
  const { mutate: updateAccommodation, isPending: updatingAccommodation } =
    useUpdateAccommodation(accommodation?.slug || "");
  
  const isPending = creatingAccommodation || updatingAccommodation;
  const isEditMode = !!accommodation?._id;

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  type StepData = {
    1: Pick<
      FormData,
      | "title"
      | "description"
      | "accommodationType"
      | "buildingType"
      | "bedrooms"
      | "bathrooms"
      | "maxGuests"
      | "parkingSpaces"
      | "propertySize"
    >;
    2: Pick<
      FormData,
      | "country"
      | "state"
      | "city"
      | "streetAddress"
      | "zipCode"
      | "checkInTime"
      | "checkOutTime"
    >;
    3: Pick<FormData, "amenities">;
    4: Pick<
      FormData,
      "basePrice" | "hasDiscount" | "discountType" | "discountValue" | "rooms"
    >;
    5: Pick<FormData, "images" | "tags" | "whatsIncluded">;
    6: Pick<
      FormData,
      "smokingPolicy" | "petPolicy" | "childrenPolicy" | "houseRules"
    >;
  };
  const validateStep = (step: StepKey): boolean => {
    const stepSchemas: Record<StepKey, z.ZodObject<z.ZodRawShape>> = {
      1: z.object({
        title: BaseFormSchema.shape.title,
        description: BaseFormSchema.shape.description,
        accommodationType: BaseFormSchema.shape.accommodationType,
        buildingType:
          formData.accommodationType === "shortlet"
            ? z.string().min(1, "Building type is required for shortlets.")
            : BaseFormSchema.shape.buildingType,
        bedrooms:
          formData.accommodationType === "shortlet"
            ? z.number().min(0, "Number of bedrooms must be 0 or more.")
            : BaseFormSchema.shape.bedrooms.optional(),
        bathrooms:
          formData.accommodationType === "shortlet"
            ? z.number().min(0, "Number of bathrooms must be 0 or more.")
            : BaseFormSchema.shape.bathrooms.optional(),
        maxGuests:
          formData.accommodationType === "shortlet"
            ? z.number().min(1, "Maximum guests must be at least 1.")
            : BaseFormSchema.shape.maxGuests.optional(),
        parkingSpaces: BaseFormSchema.shape.parkingSpaces,
        propertySize:
          formData.accommodationType === "shortlet"
            ? BaseFormSchema.shape.propertySize.optional()
            : BaseFormSchema.shape.propertySize.optional(),
      }),
      2: z.object({
        country: BaseFormSchema.shape.country,
        state: BaseFormSchema.shape.state,
        city: BaseFormSchema.shape.city,
        streetAddress: BaseFormSchema.shape.streetAddress,
        zipCode: BaseFormSchema.shape.zipCode,
        checkInTime: BaseFormSchema.shape.checkInTime,
        checkOutTime: BaseFormSchema.shape.checkOutTime,
      }),
      3: z.object({
        amenities: BaseFormSchema.shape.amenities,
      }),
      4: z.object({
        basePrice:
          formData.accommodationType === "shortlet"
            ? z.number().min(1, "Base price must be greater than 0.")
            : BaseFormSchema.shape.basePrice.optional(),
        hasDiscount: BaseFormSchema.shape.hasDiscount,
        discountType: BaseFormSchema.shape.discountType,
        discountValue: BaseFormSchema.shape.discountValue,
        rooms:
          formData.accommodationType === "hotel"
            ? z
                .array(
                  z.object({
                    name: z.string().min(1, "Room name is required"),
                    availableRooms: z
                      .number()
                      .min(1, "Available rooms must be at least 1")
                      .optional()
                      .or(z.literal(undefined)),
                    basePrice: z
                      .number()
                      .min(1, "Base price must be greater than 0")
                      .optional()
                      .or(z.literal(undefined)),
                    hasDiscount: z.boolean().optional(),
                    discountType: z.enum(["fixed", "percentage"]).optional(),
                    discountValue: z
                      .number()
                      .min(0, "Discount value must be positive")
                      .optional(),
                  })
                )
                .min(1, "At least one room is required for hotels")
            : BaseFormSchema.shape.rooms,
      }),
      5: z.object({
        images: BaseFormSchema.shape.images,
        tags: BaseFormSchema.shape.tags,
        whatsIncluded: BaseFormSchema.shape.whatsIncluded,
      }),
      6: z.object({
        smokingPolicy: BaseFormSchema.shape.smokingPolicy,
        petPolicy: BaseFormSchema.shape.petPolicy,
        childrenPolicy: BaseFormSchema.shape.childrenPolicy,
        houseRules: BaseFormSchema.shape.houseRules,
      }),
    };

    const stepData: StepData = {
      1: {
        title: formData.title,
        description: formData.description,
        accommodationType: formData.accommodationType,
        buildingType: formData.buildingType,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        maxGuests: formData.maxGuests,
        parkingSpaces: formData.parkingSpaces,
        propertySize: formData.propertySize,
      },
      2: {
        country: formData.country,
        state: formData.state,
        city: formData.city,
        streetAddress: formData.streetAddress,
        zipCode: formData.zipCode,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
      },
      3: {
        amenities: formData.amenities,
      },
      4: {
        basePrice: formData.basePrice,
        hasDiscount: formData.hasDiscount,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        rooms: formData.rooms,
      },
      5: {
        images: formData.images,
        tags: formData.tags,
        whatsIncluded: formData.whatsIncluded,
      },
      6: {
        smokingPolicy: formData.smokingPolicy,
        petPolicy: formData.petPolicy,
        childrenPolicy: formData.childrenPolicy,
        houseRules: formData.houseRules,
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

    // Additional custom validation for Step 4
    if (step === 4) {
      const newErrors: Errors = {};

      // For shortlet: validate base price is required and discount fields
      if (formData.accommodationType === "shortlet") {
        if (!formData.basePrice || formData.basePrice <= 0) {
          newErrors.basePrice =
            "Base price is required and must be greater than 0";
        }

        // Validate discount fields when discount is enabled
        if (formData.hasDiscount) {
          if (!formData.discountType) {
            newErrors.discountType =
              "Discount type is required when discount is enabled";
          }
          if (
            formData.discountValue === undefined ||
            formData.discountValue <= 0
          ) {
            newErrors.discountValue =
              "Discount value is required when discount is enabled";
          }
        }
      }

      // For hotel: validate room fields and discount fields
      if (formData.accommodationType === "hotel") {
        if (!formData.rooms || formData.rooms.length === 0) {
          newErrors.rooms = "At least one room is required for hotels";
        } else {
          formData.rooms.forEach((room, index) => {
            if (!room.name || room.name.trim() === "") {
              newErrors[`rooms.${index}.name`] = "Room name is required";
            }
            if (room.availableRooms === undefined || room.availableRooms <= 0) {
              newErrors[`rooms.${index}.availableRooms`] =
                "Available rooms is required and must be at least 1";
            }
            if (room.basePrice === undefined || room.basePrice <= 0) {
              newErrors[`rooms.${index}.basePrice`] =
                "Base price is required and must be greater than 0";
            }

            // Validate discount fields when discount is enabled
            if (room.hasDiscount) {
              if (!room.discountType) {
                newErrors[`rooms.${index}.discountType`] =
                  "Discount type is required when discount is enabled";
              }
              if (room.discountValue === undefined || room.discountValue <= 0) {
                newErrors[`rooms.${index}.discountValue`] =
                  "Discount value is required when discount is enabled";
              }
            }
          });
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
      }
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

      const requestData: CreateAccommodationListingRequest = {
        title: formData.title,
        description: formData.description,
        accommodationType: formData.accommodationType,
        buildingType: formData.buildingType,
        propertySize: formData.propertySize,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        parkingSpaces: formData.parkingSpaces ?? 0,
        maxGuests: formData.maxGuests,
        images: formData.images,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        streetAddress: formData.streetAddress,
        zipCode: formData.zipCode,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        amenities: formData.amenities,
        basePrice: formData.basePrice,
        hasDiscount: formData.hasDiscount,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        rooms: formData.rooms,
        tags: formData.tags,
        whatsIncluded: formData.whatsIncluded,
        smokingPolicy: formData.smokingPolicy,
        petPolicy: formData.petPolicy,
        childrenPolicy: formData.childrenPolicy,
        houseRules: formData.houseRules,
      };

      if (isEditMode) {
        updateAccommodation(requestData, {
          onSuccess: (response) => {
            toast.success(
              response?.message || "Accommodation updated successfully"
            );
            router.push(`/vendor/accommodations`);
          },
          onError: (error) => {
            toast.error(error?.message || "Failed to update accommodation");
          },
        });
      } else {
        createAccommodation(requestData, {
          onSuccess: (response) => {
            toast.success(
              response?.message || "Accommodation created successfully"
            );
            router.push(`/vendor/accommodations`);
          },
          onError: (error) => {
            toast.error(error?.message || "Failed to create accommodation");
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
    <div className="h-full flex flex-col event-form">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b px-4 lg:px-7 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-primary text-base lg:text-[18px] font-semibold">
              {isEditMode ? "Edit Accommodation" : "New Accommodation"}
            </h1>
            {/* <p className="hidden md:block text-gray-600 text-[11px] md:text-xs mt-0.5 md:mt-1">
              {isEditMode ? "Update your accommodation listing" : "Tell us more about your accommodation"}
            </p> */}
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
                  {isPending
                    ? (isEditMode ? "Updating Accommodation..." : "Creating Accommodation...")
                    : (isEditMode ? "Update Accommodation" : "Create Accommodation")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationListingForm;