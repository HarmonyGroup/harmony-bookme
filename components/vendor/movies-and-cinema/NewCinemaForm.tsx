"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCreateCinema } from "@/services/vendor/movies-and-cinema";
import { useUploadImage } from "@/services/shared/image-upload";
import { ImageIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { usePreventZoomAggressive } from "@/hooks/use-prevent-zoom-aggressive";

const STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Cinema details and contact info",
  },
  {
    id: 2,
    title: "Location & Operations",
    description: "Location and operating hours",
  },
  {
    id: 3,
    title: "Auditoriums",
    description: "Screening halls and auditoriums",
  },
  {
    id: 4,
    title: "Details & Media",
    description: "Images and amenities",
  },
  { id: 5, title: "Policies", description: "Rules and restrictions" },
];

const AuditoriumSchema = z.object({
  screenId: z.string().min(1, "Auditorium ID is required"),
  name: z.string().min(1, "Auditorium name is required"),
  screenType: z.enum(["Standard", "Premium", "IMAX", "Dolby"], {
    message: "Auditorium type is required",
  }),
  capacity: z.number().min(1, "Capacity must be at least 1").optional(),
});

const FormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Cinema name must be at least 2 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(5, { message: "Phone number must be at least 5 characters" }),
  socials: z
    .object({
      facebookUrl: z.string().optional().or(z.literal("")),
      instagramUrl: z.string().optional().or(z.literal("")),
      xUrl: z.string().optional().or(z.literal("")),
      tiktokUrl: z.string().optional().or(z.literal("")),
      websiteUrl: z.string().optional().or(z.literal("")),
    })
    .optional(),
  images: z
    .array(z.string().url({ message: "Each image must be a valid URL" }))
    .min(1, { message: "At least one image is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }),
  city: z.string().min(1, { message: "City is required" }),
  streetAddress: z.string().min(1, { message: "Street address is required" }),
  operatingHours: z.object({
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  }),
  auditoriums: z
    .array(AuditoriumSchema)
    .min(1, { message: "At least one auditorium is required" })
    .refine(
      (auditoriums) => auditoriums.every((aud) => aud.capacity !== undefined),
      {
        message: "All auditoriums must have a capacity",
        path: ["capacity"],
      }
    ),
  amenities: z.array(z.string()).optional(),
  petPolicy: z.enum(["yes", "no"]),
  childrenPolicy: z.enum(["yes", "no"]),
  ageRestriction: z.number().min(1).max(100).optional(),
  houseRules: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;
type Errors = Record<string, string>;
type StepKey = 1 | 2 | 3 | 4 | 5;

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors: Errors;
  setErrors: (errors: Errors) => void;
}

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

  const handleSocialsChange = (
    field: keyof NonNullable<FormData["socials"]>,
    value: string
  ) => {
    updateFormData({
      socials: { ...formData.socials, [field]: value } as FormData["socials"],
    });
    setErrors({ ...errors, [`socials.${field}`]: "" });
  };


  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Cinema Name</Label>
        <Input
          placeholder="e.g. Starlight Cinemas"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Description</Label>
        <Textarea
          placeholder="Describe your cinema (e.g., ambiance, special features)"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="!text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Contact Email</Label>
        <Input
          type="email"
          placeholder="e.g. contact@cinema.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Contact Phone</Label>
        <Input
          type="tel"
          placeholder="e.g. +1234567890"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Social Media (Optional)</Label>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Facebook URL"
              value={formData.socials?.facebookUrl || ""}
              onChange={(e) =>
                handleSocialsChange("facebookUrl", e.target.value)
              }
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors["socials.facebookUrl"] && (
              <p className="text-xs text-red-600">
                {errors["socials.facebookUrl"]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Instagram URL"
              value={formData.socials?.instagramUrl || ""}
              onChange={(e) =>
                handleSocialsChange("instagramUrl", e.target.value)
              }
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors["socials.instagramUrl"] && (
              <p className="text-xs text-red-600">
                {errors["socials.instagramUrl"]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="X URL"
              value={formData.socials?.xUrl || ""}
              onChange={(e) => handleSocialsChange("xUrl", e.target.value)}
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors["socials.xUrl"] && (
              <p className="text-xs text-red-600">{errors["socials.xUrl"]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="TikTok URL"
              value={formData.socials?.tiktokUrl || ""}
              onChange={(e) => handleSocialsChange("tiktokUrl", e.target.value)}
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors["socials.tiktokUrl"] && (
              <p className="text-xs text-red-600">
                {errors["socials.tiktokUrl"]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Website URL"
              value={formData.socials?.websiteUrl || ""}
              onChange={(e) =>
                handleSocialsChange("websiteUrl", e.target.value)
              }
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors["socials.websiteUrl"] && (
              <p className="text-xs text-red-600">
                {errors["socials.websiteUrl"]}
              </p>
            )}
          </div>
        </div>
        {errors.socials && (
          <p className="text-xs text-red-600">{errors.socials}</p>
        )}
      </div>
    </div>
  );
};

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

  const handleOperatingHoursChange = (
    field: "startTime" | "endTime",
    value: string
  ) => {
    updateFormData({
      operatingHours: {
        ...formData.operatingHours,
        [field]: value,
      } as FormData["operatingHours"],
    });
    setErrors({ ...errors, [`operatingHours.${field}`]: "" });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Street Address</Label>
        <Input
          placeholder="e.g. 123 Cinema Lane"
          value={formData.streetAddress}
          onChange={(e) => handleInputChange("streetAddress", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.streetAddress && (
          <p className="text-xs text-red-600">{errors.streetAddress}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">City</Label>
        <Input
          placeholder="e.g. Lagos"
          value={formData.city}
          onChange={(e) => handleInputChange("city", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">State</Label>
        <Input
          placeholder="e.g. Lagos State"
          value={formData.state}
          onChange={(e) => handleInputChange("state", e.target.value)}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.state && <p className="text-xs text-red-600">{errors.state}</p>}
      </div>
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
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">
          Operating Hours
        </Label>
        <div className="w-full flex items-center gap-4">
          <div className="w-full space-y-2">
            <Input
              type="time"
              placeholder="Start Time (e.g. 09:00)"
              value={formData.operatingHours?.startTime || ""}
              onChange={(e) =>
                handleOperatingHoursChange("startTime", e.target.value)
              }
              className="w-full !py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors["operatingHours.startTime"] && (
              <p className="text-xs text-red-600">
                {errors["operatingHours.startTime"]}
              </p>
            )}
          </div>
          <div className="w-full space-y-2">
            <Input
              type="time"
              placeholder="End Time (e.g. 23:00)"
              value={formData.operatingHours?.endTime || ""}
              onChange={(e) =>
                handleOperatingHoursChange("endTime", e.target.value)
              }
              className="w-full !py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors["operatingHours.endTime"] && (
              <p className="text-xs text-red-600">
                {errors["operatingHours.endTime"]}
              </p>
            )}
          </div>
        </div>
        {/* <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="time"
              placeholder="Start Time (e.g. 09:00)"
              value={formData.operatingHours?.startTime || ""}
              onChange={(e) =>
                handleOperatingHoursChange("startTime", e.target.value)
              }
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors["operatingHours.startTime"] && (
              <p className="text-xs text-red-600">
                {errors["operatingHours.startTime"]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Input
            type="time"
              placeholder="End Time (e.g. 23:00)"
              value={formData.operatingHours?.endTime || ""}
              onChange={(e) =>
                handleOperatingHoursChange("endTime", e.target.value)
              }
              className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
            />
            {errors["operatingHours.endTime"] && (
              <p className="text-xs text-red-600">
                {errors["operatingHours.endTime"]}
              </p>
            )}
          </div>
        </div> */}
        {errors.operatingHours && (
          <p className="text-xs text-red-600">{errors.operatingHours}</p>
        )}
      </div>
    </div>
  );
};

const Step3Form: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
}) => {
  const handleAuditoriumChange = (
    index: number,
    field: keyof z.infer<typeof AuditoriumSchema>,
    value: string | number | undefined
  ) => {
    updateFormData({
      auditoriums: formData.auditoriums.map((aud, i) =>
        i === index ? { ...aud, [field]: value } : aud
      ),
    });
    setErrors({ ...errors, [`auditoriums.${index}.${field}`]: "" });
  };

  const addAuditorium = () => {
    updateFormData({
      auditoriums: [
        ...formData.auditoriums,
        { screenId: "", name: "", screenType: "Standard", capacity: undefined },
      ],
    });
  };

  const removeAuditorium = (index: number) => {
    updateFormData({
      auditoriums: formData.auditoriums.filter((_, i) => i !== index),
    });
  };


  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">Auditoriums</Label>
        <div className="space-y-4">
          {formData.auditoriums.map((auditorium, index) => (
            <div key={index} className="border p-4 rounded-md space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Screen ID</Label>
                <Input
                  placeholder="e.g. Screen1"
                  value={auditorium.screenId}
                  onChange={(e) =>
                    handleAuditoriumChange(index, "screenId", e.target.value)
                  }
                  className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                />
                {errors[`auditoriums.${index}.screenId`] && (
                  <p className="text-xs text-red-600">
                    {errors[`auditoriums.${index}.screenId`]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Auditorium Name</Label>
                <Input
                  placeholder="e.g. Main Hall"
                  value={auditorium.name}
                  onChange={(e) =>
                    handleAuditoriumChange(index, "name", e.target.value)
                  }
                  className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                />
                {errors[`auditoriums.${index}.name`] && (
                  <p className="text-xs text-red-600">
                    {errors[`auditoriums.${index}.name`]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Screen Type</Label>
                <Select
                  value={auditorium.screenType}
                  onValueChange={(value) =>
                    handleAuditoriumChange(index, "screenType", value)
                  }
                >
                  <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
                    <SelectValue placeholder="Select screen type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="Standard"
                      className="text-xs cursor-pointer"
                    >
                      Standard
                    </SelectItem>
                    <SelectItem
                      value="Premium"
                      className="text-xs cursor-pointer"
                    >
                      Premium
                    </SelectItem>
                    <SelectItem value="IMAX" className="text-xs cursor-pointer">
                      IMAX
                    </SelectItem>
                    <SelectItem
                      value="Dolby"
                      className="text-xs cursor-pointer"
                    >
                      Dolby
                    </SelectItem>
                    <SelectItem
                      value="Others"
                      className="text-xs cursor-pointer"
                    >
                      Others
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors[`auditoriums.${index}.screenType`] && (
                  <p className="text-xs text-red-600">
                    {errors[`auditoriums.${index}.screenType`]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 text-xs">Capacity</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  value={auditorium.capacity ?? ""}
                  onChange={(e) =>
                    handleAuditoriumChange(
                      index,
                      "capacity",
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                  onWheel={(e) => e.currentTarget.blur()}
                  className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                />
                {errors[`auditoriums.${index}.capacity`] && (
                  <p className="text-xs text-red-600">
                    {errors[`auditoriums.${index}.capacity`]}
                  </p>
                )}
              </div>
              {formData.auditoriums.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeAuditorium(index)}
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
                  Remove Auditorium
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addAuditorium}
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
            Add Auditorium
          </Button>
        </div>
        {errors.auditoriums && (
          <p className="text-xs text-red-600">{errors.auditoriums}</p>
        )}
      </div>
    </div>
  );
};

const Step4Form: React.FC<StepProps> = ({
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

  const handleArrayChange = (
    field: "amenities",
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
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(
        `Failed to upload images: ${errorMessage}`
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

      <div className="space-y-4">
        <div>
          <Label className="text-gray-600 text-xs mb-2 block">
            Amenities (Optional)
          </Label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="e.g. Wheelchair Access, 3D Glasses, Hearing Assistance"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleArrayChange(
                    "amenities",
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
                  handleArrayChange("amenities", input.value, "add");
                  input.value = "";
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.amenities || []).map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-xs flex items-center gap-2"
              >
                {item}
                <button
                  type="button"
                  onClick={() =>
                    handleArrayChange("amenities", item, "remove")
                  }
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {errors.amenities && (
            <p className="text-xs text-red-600">{errors.amenities}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Step5Form: React.FC<StepProps> = ({
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
        <Label className="text-gray-600 text-xs">Pet Policy</Label>
        <Select
          value={formData.petPolicy}
          onValueChange={(value) =>
            handleInputChange("petPolicy", value as "yes" | "no")
          }
        >
          <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
            <SelectValue placeholder="Select pet policy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes" className="text-xs cursor-pointer">
              Yes, pets allowed
            </SelectItem>
            <SelectItem value="no" className="text-xs cursor-pointer">
              No, pets not allowed
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
            handleInputChange("childrenPolicy", value as "yes" | "no")
          }
        >
          <SelectTrigger className="w-full !py-6 !text-xs font-normal shadow-none cursor-pointer">
            <SelectValue placeholder="Select children policy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes" className="text-xs cursor-pointer">
              Yes, children allowed
            </SelectItem>
            <SelectItem value="no" className="text-xs cursor-pointer">
              No, children not allowed
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.childrenPolicy && (
          <p className="text-xs text-red-600">{errors.childrenPolicy}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">
          Age Restriction (Optional)
        </Label>
        <Input
          type="number"
          min="1"
          max="100"
          placeholder="e.g. 18"
          value={formData.ageRestriction ?? ""}
          onChange={(e) =>
            handleInputChange(
              "ageRestriction",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          onWheel={(e) => e.currentTarget.blur()}
          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.ageRestriction && (
          <p className="text-xs text-red-600">{errors.ageRestriction}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-gray-600 text-xs">House Rules (Optional)</Label>
        <Textarea
          placeholder="e.g. No outside food, silence phones"
          value={formData.houseRules || ""}
          onChange={(e) => handleInputChange("houseRules", e.target.value)}
          className="!text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
        />
        {errors.houseRules && (
          <p className="text-xs text-red-600">{errors.houseRules}</p>
        )}
      </div>
    </div>
  );
};

const NewCinemaForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepKey>(1);
  
  // Prevent zoom on mobile when focusing inputs
  usePreventZoomAggressive();
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    email: "",
    phone: "",
    socials: {
      facebookUrl: "",
      instagramUrl: "",
      xUrl: "",
      tiktokUrl: "",
      websiteUrl: "",
    },
    images: [],
    country: "",
    state: "",
    city: "",
    streetAddress: "",
    operatingHours: { startTime: "", endTime: "" },
    auditoriums: [
      { screenId: "", name: "", screenType: "Standard", capacity: undefined },
    ],
    amenities: [],
    petPolicy: "no",
    childrenPolicy: "no",
    ageRestriction: undefined,
    houseRules: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const { mutate: createCinema, isPending: creatingCinema } = useCreateCinema();

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  type StepData = {
    1: Pick<
      FormData,
      "title" | "description" | "email" | "phone" | "socials"
    >;
    2: Pick<
      FormData,
      "country" | "state" | "city" | "streetAddress" | "operatingHours"
    >;
    3: Pick<FormData, "auditoriums">;
    4: Pick<FormData, "images" | "amenities">;
    5: Pick<
      FormData,
      "petPolicy" | "childrenPolicy" | "ageRestriction" | "houseRules"
    >;
  };

  const validateStep = (step: StepKey): boolean => {
    const stepSchemas: Record<StepKey, z.ZodObject<Record<string, z.ZodTypeAny>>> = {
      1: z.object({
        title: FormSchema.shape.title,
        description: FormSchema.shape.description,
        email: FormSchema.shape.email,
        phone: FormSchema.shape.phone,
        socials: FormSchema.shape.socials,
      }),
      2: z.object({
        country: FormSchema.shape.country,
        state: FormSchema.shape.state,
        city: FormSchema.shape.city,
        streetAddress: FormSchema.shape.streetAddress,
        operatingHours: FormSchema.shape.operatingHours,
      }),
      3: z.object({
        auditoriums: FormSchema.shape.auditoriums,
      }),
      4: z.object({
        images: FormSchema.shape.images,
        amenities: FormSchema.shape.amenities,
      }),
      5: z.object({
        petPolicy: FormSchema.shape.petPolicy,
        childrenPolicy: FormSchema.shape.childrenPolicy,
        ageRestriction: FormSchema.shape.ageRestriction,
        houseRules: FormSchema.shape.houseRules,
      }),
    };

    const stepData: StepData = {
      1: {
        title: formData.title,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        socials: formData.socials,
      },
      2: {
        country: formData.country,
        state: formData.state,
        city: formData.city,
        streetAddress: formData.streetAddress,
        operatingHours: formData.operatingHours,
      },
      3: {
        auditoriums: formData.auditoriums,
      },
      4: {
        images: formData.images,
        amenities: formData.amenities,
      },
      5: {
        petPolicy: formData.petPolicy,
        childrenPolicy: formData.childrenPolicy,
        ageRestriction: formData.ageRestriction,
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
    setErrors({});
    return true;
  };

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (validateStep(currentStep) && currentStep < STEPS.length) {
      setCurrentStep((prev) => (prev < 5 ? ((prev + 1) as StepKey) : prev));
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

      try {
        // Filter out auditoriums with undefined capacity and ensure they have valid capacity
        const cleanedFormData = {
          ...formData,
          auditoriums: formData.auditoriums
            .filter((aud) => aud.capacity !== undefined)
            .map((aud) => ({
              ...aud,
              capacity: aud.capacity!,
            })),
        };

        createCinema(cleanedFormData, {
          onSuccess: (response) => {
            toast.success(response?.message ?? "Cinema created successfully");
            router.push(`/vendor/cinemas`);
          },
          onError: (error) => {
            toast.error(error?.message ?? "Something went wrong");
          },
        });
      } catch {
        toast.error("Failed to create cinema");
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
              Create Cinema
            </h1>
            <p className="hidden md:block text-gray-600 text-[11px] md:text-xs mt-0.5 md:mt-1">
              List a new cinema for your business
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
                  disabled={creatingCinema}
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
                  disabled={creatingCinema}
                >
                  {creatingCinema ? (
                    <span>Creating...</span>
                  ) : (
                    <span>Create Cinema</span>
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

export default NewCinemaForm;