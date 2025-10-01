"use client";

import React, { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
import DarkLogo from "@/public/assets/logo-wordmark-dark.png";
import { BsInfoCircle, BsEye, BsEyeSlash } from "react-icons/bs";
import { useSignup } from "@/services/auth/signup";
import { vendorAccountPreferences } from "@/constants/vendor-account-preferences";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BG from "@/public/assets/sun-tornado.svg";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displaySlide, setDisplaySlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for GSAP animations
  const pageRef = useRef(null);
  const formRef = useRef(null);
  const imageRef = useRef(null);
  const carouselRef = useRef(null);
  const progressRef = useRef(null);
  const logoRef = useRef(null);
  const mobileLogoRef = useRef(null);

  // Carousel content for vendors
  const carouselContent = [
    {
      title: "Start Your Journey",
      subtitle:
        "Join thousands of vendors who trust us to grow their business. Create your account and start listing your services today.",
      highlight: "Get Started",
    },
    {
      title: "Build Your Brand",
      subtitle:
        "Showcase your business with professional listings. From events to accommodations, reach customers who are looking for you.",
      highlight: "Brand Building",
    },
    {
      title: "Grow Your Revenue",
      subtitle:
        "Increase your bookings and revenue with our powerful platform. Track performance and optimize your listings for better results.",
      highlight: "Revenue Growth",
    },
    {
      title: "Join Our Community",
      subtitle:
        "Connect with other vendors, share experiences, and learn from the best. Be part of a thriving business community.",
      highlight: "Community",
    },
  ];

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

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Form animations - slides upwards
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: 0.3,
        }
      );

      // Image section animations - no slide, just fade in
      gsap.fromTo(
        imageRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          delay: 0.5,
        }
      );

      // Logo animation - slides down and fades in
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2,
        }
      );

      // Mobile logo animation - slides down and fades in
      gsap.fromTo(
        mobileLogoRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.1,
        }
      );

      // Carousel initial animation - slides upwards
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.7,
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Carousel auto-advance
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselContent.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Progress bar animation
  useEffect(() => {
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 4,
          ease: "none",
          transformOrigin: "left",
        }
      );
    }
  }, [currentSlide]);

  // Carousel slide animation - slides upwards
  useEffect(() => {
    if (carouselRef.current && currentSlide !== displaySlide) {
      // Animate out
      gsap.to(carouselRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          // Content changes here (highlight, title, subtitle all change together)
          setDisplaySlide(currentSlide);
          // Then animate back in
          gsap.fromTo(
            carouselRef.current,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
            }
          );
        },
      });
    }
  }, [currentSlide, displaySlide]);

  return (
    <section ref={pageRef} className="h-screen overflow-hidden">
      <div className="flex h-full">
        <div className="w-full md:flex-1 overflow-y-auto px-4 py-5 md:px-10 md:py-20 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          <div className="flex flex-col items-start md:items-center justify-center min-h-full">
            <div>
              <Image
                ref={mobileLogoRef}
                src={DarkLogo}
                alt="Harmony BookMe"
                className=" block md:hidden w-[160px]"
                loading="eager"
              />
            </div>
            <div ref={formRef} className="w-full mx-auto md:max-w-md py-16 md:py-0">
              <h2 className="mb-2.5 md:mb-2 text-primary text-xl md:text-2xl font-semibold">
                Get Started
              </h2>
              <p className="text-gray-700 text-xs mb-12 md:mb-12">
                Fill the form below to create your vendor account
              </p>
              <Form {...form}>
                <div className="pb-4">
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs md:text-[13px] font-medium gap-0.5">
                              First name
                              <span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter first name"
                                {...field}
                                className="!py-6 !text-xs md:!text-[13px] font-normal placeholder:text-gray-500 placeholder:text-xs md:placeholder:text-[13px] placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                              />
                            </FormControl>
                            <FormMessage className="text-xs md:text-[13px]" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-xs md:text-[13px] font-medium gap-0.5">
                              Last name
                              <span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter last name"
                                {...field}
                                className="!py-6 !text-xs md:!text-[13px] font-normal placeholder:text-gray-500 placeholder:text-xs md:placeholder:text-[13px] placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                              />
                            </FormControl>
                            <FormMessage className="text-xs md:text-[13px]" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-xs md:text-[13px] font-medium gap-0.5">
                            Business name
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter business name"
                              {...field}
                              className="!py-6 !text-xs md:!text-[13px] font-normal placeholder:text-gray-500 placeholder:text-xs md:placeholder:text-[13px] placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            />
                          </FormControl>
                          <FormMessage className="text-xs md:text-[13px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vendorAccountPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-xs md:text-[13px] font-medium gap-0.5">
                            Account preference
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full !py-6 !text-xs md:!text-[13px] font-normal placeholder:text-gray-500 placeholder:text-xs md:placeholder:text-[13px] placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 cursor-pointer">
                                <SelectValue placeholder="Select an account preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vendorAccountPreferences?.map(
                                (preference, index) => (
                                  <SelectItem
                                    key={index}
                                    value={preference?.value}
                                    className="text-gray-600 text-xs md:text-[13px] !py-2.5 cursor-pointer"
                                  >
                                    {preference?.label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription className="flex items-center gap-1.5 text-gray-600 text-[11px] md:text-[12px]">
                            <BsInfoCircle size={12} />
                            This helps us personalize your experience
                          </FormDescription>
                          <FormMessage className="text-xs md:text-[13px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-xs md:text-[13px] font-medium gap-0.5">
                            Phone Number
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
                              {...field}
                              className="!py-6 !text-xs md:!text-[13px] font-normal placeholder:text-gray-500 placeholder:text-xs md:placeholder:text-[13px] placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            />
                          </FormControl>
                          <FormMessage className="text-xs md:text-[13px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-xs md:text-[13px] font-medium gap-0.5">
                            Email Address
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter email address"
                              {...field}
                              className="!py-6 !text-xs md:!text-[13px] font-normal placeholder:text-gray-500 placeholder:text-xs md:placeholder:text-[13px] placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
                            />
                          </FormControl>
                          <FormMessage className="text-xs md:text-[13px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-xs md:text-[13px] font-medium gap-0.5">
                            Password
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter password"
                                {...field}
                                className="!py-6 !text-xs md:!text-[13px] font-normal placeholder:text-gray-500 placeholder:text-xs md:placeholder:text-[13px] placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 !pr-12"
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
                          <FormMessage className="text-xs md:text-[13px]" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="flex items-center justify-center bg-[#183264] w-full text-xs md:text-[13px] font-semibold !py-6 cursor-pointer hover:bg-[#183264]/90 transition-all ease-in-out duration-300"
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
                  className="font-semibold text-[#183264] hover:underline underline-offset-2 transition-all ease-in-out duration-300"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div
          ref={imageRef}
          className="w-1/2 h-full -order-1 hidden md:block overflow-hidden"
        >
          <div className="auth-image-banner flex flex-col relative">
            <Image
              src={BG}
              layout="fill"
              objectFit="cover"
              alt="Harmony BookMe"
              className="auth-image"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/40" />

            <div className="relative p-6 z-10">
              <Link href={"/"}>
                <Image
                  ref={logoRef}
                  src={Logo}
                  className="w-[200px]"
                  alt="Harmony BookMe"
                  loading="eager"
                />
              </Link>
            </div>

            <div className="h-full w-full flex flex-col items-center justify-center relative z-10 px-6">
              <div ref={carouselRef} className="max-w-lg -mt-16 bg-white/5 rounded-xl p-12">
                {/* Main Headline */}
                <h1 className="text-white text-3xl font-semibold mb-4 leading-tight">
                  {carouselContent[displaySlide].title}
                </h1>

                <p className="text-white/80 text-[13px] leading-relaxed mb-8">
                  {carouselContent[displaySlide].subtitle}
                </p>

                {/* Carousel Indicators */}
                <div
                  className="flex items-center justify-start space-x-3"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {carouselContent.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`relative transition-all duration-300 group ${
                        index === currentSlide
                          ? "w-[6px] h-[6px] bg-white rounded-full"
                          : "w-[6px] h-[6px] bg-white/40 rounded-full hover:bg-white/70 hover:w-6"
                      }`}
                    >
                      {index === currentSlide && (
                        <div
                          ref={progressRef}
                          className="absolute inset-0 bg-white/30 rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;