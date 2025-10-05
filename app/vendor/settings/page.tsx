// components/vendor/settings/Page.tsx
"use client";

import React from "react";
import VendorSettingsLayout from "@/components/vendor/layouts/VendorSettingsLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useGetVendorInformation,
  useUpdateVendorInformation,
} from "@/services/vendor/account";
import { useUploadImage } from "@/services/shared/image-upload";
import { useUpdateAvatar, useRemoveAvatar } from "@/services/shared/avatar";
import Image from "next/image";
import { toast } from "sonner";
// import GeneralSkeleton from "@/components/vendor/settings/GeneralSkeleton";

const FormSchema = z.object({
  businessName: z.string().min(1, {
    message: "Business name is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  streetAddress: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal("")),
});

const Page = () => {
  const { data: vendorData } = useGetVendorInformation();
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      businessName: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      streetAddress: "",
      avatar: "",
    },
  });

  const { mutate: updateVendorDetails, isPending } =
    useUpdateVendorInformation();

  const { mutate: uploadImage } = useUploadImage();
  const { mutate: updateAvatar } = useUpdateAvatar();
  const { mutate: removeAvatar } = useRemoveAvatar();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    updateVendorDetails(data, {
      onSuccess: (response) => {
        toast.success(response.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, or GIF files are allowed.");
      return;
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("File size must be under 2MB.");
      return;
    }

    setIsUploadingAvatar(true);
    const loadingToast = toast.loading("Uploading avatar...");

    const formData = new FormData();
    formData.append("file", file);

    uploadImage(formData, {
      onSuccess: (response) => {
        toast.dismiss(loadingToast);
        toast.success("Avatar uploaded successfully!");

        // Update the form with the new avatar URL
        form.setValue("avatar", response.data.url);

        // Update the avatar in the database
        updateAvatar(
          { avatar: response.data.url },
          {
            onSuccess: () => {
              toast.success("Avatar updated successfully!");
            },
            onError: (error) => {
              toast.error(error.message);
            },
          }
        );
      },
      onError: (error) => {
        toast.dismiss(loadingToast);
        toast.error(error.message);
      },
      onSettled: () => {
        setIsUploadingAvatar(false);
      },
    });
  };

  const handleRemoveAvatar = () => {
    const loadingToast = toast.loading("Removing avatar...");

    removeAvatar(undefined, {
      onSuccess: () => {
        toast.dismiss(loadingToast);
        toast.success("Avatar removed successfully!");

        // Update the form to remove the avatar
        form.setValue("avatar", "");
      },
      onError: (error) => {
        toast.dismiss(loadingToast);
        toast.error(error.message);
      },
    });
  };

  React.useEffect(() => {
    if (vendorData?.data) {
      form.reset({
        businessName: vendorData.data.businessName || "",
        email: vendorData.data.email || "",
        phone: vendorData.data.phone || "",
        country: vendorData.data.country || "",
        state: vendorData.data.state || "",
        city: vendorData.data.city || "",
        streetAddress: vendorData.data.streetAddress || "",
        avatar: vendorData.data.avatar || "",
      });
    }
  }, [vendorData, form]);

  return (
    <section className="h-full flex flex-col">
      {/* <div className="mb-6">
        <h1 className="text-primary text-xl font-semibold">General</h1>
        <p className="text-gray-700 text-xs mt-1.5">
          Manage your account settings and set preferences
        </p>
      </div> */}

      <div className="border-b border-gray-200/80 p-4 py-5 md:px-5 md:py-6">
        <h1 className="text-primary text-base md:text-xl font-semibold">
          Account Settings
        </h1>
        {/* <p className="text-gray-700 text-[11px] md:text-xs mt-1">
          Manage your account settings and set preferences
        </p> */}
      </div>

      <VendorSettingsLayout>
        <div className="px-6 py-5">
          <>
            <div className="flex items-center gap-4">
              <div className="size-28 bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                {form.watch("avatar") ? (
                  <Image
                    src={form.watch("avatar") || ""}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    width={112}
                    height={112}
                    priority
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-10 text-gray-400"
                  >
                    <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                    <path
                      fillRule="evenodd"
                      d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                    disabled={isUploadingAvatar}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="text-[11px] !h-fit py-2 px-3 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/90 transition-colors ease-in-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingAvatar ? "Uploading..." : "Change Image"}
                  </label>
                  {form.watch("avatar") && (
                    <Button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="bg-muted text-[11px] text-gray-700 hover:bg-muted hover:text-gray-700 !h-fit py-2 cursor-pointer"
                      disabled={isUploadingAvatar}
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
                <p className="text-gray-500 text-[11px] mt-3">
                  We support PNGs, JPEGs and GIFs under 2MB
                </p>
              </div>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 mt-6"
              >
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 text-xs">
                        Business name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                          placeholder="Enter business name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-600 text-xs">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            placeholder="Enter email address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-600 text-xs">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            placeholder="Enter phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-600 text-xs">
                          Country
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            placeholder="Enter country"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-600 text-xs">
                          State
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            placeholder="Enter state"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-600 text-xs">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            placeholder="Enter city"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-600 text-xs">
                          Street Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="!py-6 !text-xs font-normal shadow-none placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            placeholder="Enter street address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-primary text-xs float-end cursor-pointer transition-colors ease-in-out duration-200 p-5"
                  disabled={isPending}
                >
                  {isPending ? "Saving changes..." : "Save changes"}
                </Button>
              </form>
            </Form>
          </>
        </div>
      </VendorSettingsLayout>
    </section>
  );
};

export default Page;