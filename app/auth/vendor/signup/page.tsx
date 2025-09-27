"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/assets/logo-wordmark-light.png";
import { BsInfoCircle, BsEye, BsEyeSlash } from "react-icons/bs";
import { useSignup } from "@/services/auth/signup";
import { vendorAccountPreferences } from "@/constants/vendor-account-preferences";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  vendorAccountPreference: z.string({
    required_error: "Please select an account preference",
  }),
  phone: z.string().min(5, {
    message: "Phone number is required",
  }),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  role: z.enum(["vendor", "explorer", "super_admin", "sub_admin"]),
});

const Page = () => {
  const router = useRouter();
  const { mutate, isPending } = useSignup();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      businessName: "",
      vendorAccountPreference: "",
      phone: "",
      email: "",
      password: "",
      role: "vendor",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    mutate(data, {
      onSuccess: (response) => {
        toast.success(response?.message || "Account created successfully");
        router.push("/vendor/dashboard");
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to create account");
      },
    });
  };

  return (
    <section>
      <div className="grid gap-0 md:h-screen md:grid-cols-3">
        <div className="flex items-center justify-center px-5 py-16 md:px-10 md:py-20 md:col-span-2">
          <div className="w-full mx-auto md:max-w-md ">
            <h2 className="mb-1.5 md:mb-2 text-primary text-lg md:text-xl font-semibold">
              Vendor Signup
            </h2>
            <p className="text-gray-600 text-xs mb-8 md:mb-12 lg:mb-12">
              Fill the form below to create a vendor account
            </p>
            <Form {...form}>
              <div className="pb-4">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-xs font-medium gap-0.5">
                          First name
                          <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            {...field}
                            className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                          />
                        </FormControl>
                        <FormDescription className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                          <BsInfoCircle size={12} />
                          Business owner, stakeholder or representative.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-xs font-medium gap-0.5">
                          Last name
                          <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
                            {...field}
                            className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                          />
                        </FormControl>
                        <FormDescription className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                          <BsInfoCircle size={12} />
                          Business owner, stakeholder or representative.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-xs font-medium gap-0.5">
                          Business name
                          <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter business name"
                            {...field}
                            className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vendorAccountPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-xs font-medium gap-0.5">
                          Account preference
                          <span className="text-red-400">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full !py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 cursor-pointer">
                              <SelectValue placeholder="Select an account preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vendorAccountPreferences?.map(
                              (preference, index) => (
                                <SelectItem
                                  key={index}
                                  value={preference?.value}
                                  className="text-gray-600 text-xs !py-2.5 cursor-pointer"
                                >
                                  {preference?.label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription className="flex items-center gap-1.5 text-gray-600 text-[11px]">
                          <BsInfoCircle size={12} />
                          This helps us personalize your experience
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-xs font-medium gap-0.5">
                          Phone Number
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number"
                            {...field}
                            className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-xs font-medium gap-0.5">
                          Email Address
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter email address"
                            {...field}
                            className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-xs font-medium gap-0.5">
                          Password
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter password"
                              {...field}
                              className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 !pr-12"
                              type={showPassword ? "text" : "password"}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none cursor-pointer"
                            >
                              {showPassword ? (
                                <BsEyeSlash size={16} />
                              ) : (
                                <BsEye size={16} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="flex items-center justify-center bg-[#183264] w-full text-xs font-semibold !py-6 cursor-pointer hover:bg-[#183264]/90 transition-all ease-in-out duration-300"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <span className="loader"></span>
                    ) : (
                      <span>Signup</span>
                    )}
                  </Button>
                </form>
              </div>
            </Form>
            <p className="text-xs text-gray-700">
              Already have a vendor account?{" "}
              <Link
                href="/auth/vendor/login"
                className="font-semibold text-primary hover:underline underline-offset-2 transition-all ease-in-out duration-300"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-image-banner -order-1">
          <Image
            src={
              "https://img.freepik.com/free-photo/medium-shot-woman-holding-laptop_23-2149145024.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
            }
            layout="fill"
            objectFit="cover"
            alt="Harmony BookMe"
            className="auth-image"
            loading="eager"
          />
          <div className="relative p-6 z-10">
            <Link href={"/"}>
              <Image
                src={Logo}
                className="w-[180px] md:w-[240px]"
                alt="Harmony BookMe"
                loading="eager"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;