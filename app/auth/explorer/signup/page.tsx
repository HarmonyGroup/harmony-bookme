"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import BG from "@/public/assets/auth-bg.jpg";
import Logo from "@/public/assets/logo-wordmark-light.png";
import { useSignup } from "@/services/auth/signup";

const FormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["vendor", "explorer", "super_admin", "sub_admin"]),
});

const Page = () => {
  
  const { mutate, isPending } = useSignup();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "explorer",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    mutate(data);
  };

  return (
    <section>
      <div className="grid gap-0 md:h-screen md:grid-cols-3">
        <div className="flex items-center justify-center px-5 py-16 md:px-10 md:py-20 md:col-span-2">
          <div className="w-full mx-auto md:max-w-md ">
            <h2 className="mb-1.5 md:mb-2 text-primary text-lg md:text-xl font-semibold">
              Explorer Signup
            </h2>
            <p className="text-gray-600 text-xs mb-8 md:mb-12 lg:mb-12">
              Fill the form below to create an explorer account
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
                          Email
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
                          <Input
                            placeholder="Enter password"
                            {...field}
                            className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            type="password"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="flex items-center justify-center bg-primary w-full text-xs font-semibold !py-6 cursor-pointer hover:bg-primary/85 transition-all ease-in-out duration-300 disabled:!bg-primary/85 disabled:opacity-100"
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
              Already have an explorer account?{" "}
              <Link
                href="/auth/explorer/login"
                className="font-semibold text-primary hover:underline underline-offset-2 transition-all ease-in-out duration-300"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-image-banner -order-1">
          <Image
            src={BG}
            layout="fill"
            objectFit="cover"
            alt="Harmony BookMe"
            className="auth-image"
          />
          <div className="relative p-6 z-10">
            <Link href={"/"}>
              <Image
                src={Logo}
                className="w-[180px] md:w-[240px]"
                alt="Harmony BookMe"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;