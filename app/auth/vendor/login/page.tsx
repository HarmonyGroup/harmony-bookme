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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/assets/logo-wordmark-light.png";
import DarkLogo from "@/public/assets/logo-wordmark-dark.png";
import { useSignIn } from "@/services/auth/login";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePreventZoomAggressive } from "@/hooks/use-prevent-zoom-aggressive";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import BG from "@/public/assets/sun-tornado.svg";

const FormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displaySlide, setDisplaySlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();
  const { signIn, isPending } = useSignIn();
  
  // Prevent zoom on mobile when focusing inputs
  usePreventZoomAggressive();

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
      title: "Grow Your Brand",
      subtitle:
        "Reach thousands of customers looking for your services. List your events, accommodations, movies, and leisure activities in one place.",
      highlight: "Brand Growth",
    },
    {
      title: "Easy Management",
      subtitle:
        "Manage all your bookings, payments, and customer interactions from a single dashboard. No more juggling multiple platforms.",
      highlight: "Simple Dashboard",
    },
    {
      title: "Secure Payments",
      subtitle:
        "Get paid securely and on time. Our integrated payment system handles all transactions with zero hassle for you.",
      highlight: "Payment Security",
    },
    {
      title: "Real-time Analytics",
      subtitle:
        "Track your performance with detailed analytics. See what's working and optimize your listings for better results.",
      highlight: "Data Insights",
    },
  ];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    signIn(data, {
      onSuccess: () => {
        toast.success("Signed in successfully");
        router.push("/vendor/dashboard");
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
  }, [isPaused, carouselContent.length]);

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
  }, [currentSlide, progressRef]);

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
  }, [currentSlide, displaySlide, carouselRef]);

  return (
    <section ref={pageRef}>
      <div className="grid gap-0 min-h-screen md:grid-cols-2">
        <div className="relative h-full flex items-center justify-center px-4 py-16 md:px-10 md:py-20">
           <Image
             ref={mobileLogoRef}
             src={DarkLogo}
             alt="Harmony BookMe"
             className="absolute !top-4 !left-4 block md:hidden w-[160px]"
             loading="eager"
           />
          <div ref={formRef} className="w-full mx-auto md:max-w-md">
            <h2 className="mb-2.5 md:mb-2 text-primary text-xl md:text-2xl font-semibold">
              Welcome Back!
            </h2>
            <p className="text-gray-700 text-xs mb-12 md:mb-12">
              Please enter your credentials to access your dashboard.
            </p>
            <Form {...form}>
              <div className="pb-4">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="auth-form space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-xs md:text-[13px] font-medium gap-0.5">
                          Email
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="xyz@email.com"
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
                              placeholder="********"
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
                      <span>Login</span>
                    )}
                  </Button>
                </form>
              </div>
            </Form>
            <p className="text-xs text-gray-700">
              Don&apos;t have a vendor account yet?{" "}
              <Link
                href="/auth/vendor/signup"
                className="font-semibold text-[#183264] hover:underline underline-offset-2 transition-all ease-in-out duration-300"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>

        <div ref={imageRef} className="h-full w-full -order-1 hidden md:block">
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
                  className="w-[180px] md:w-[170px]"
                  alt="Harmony BookMe"
                  loading="eager"
                />
              </Link>
            </div>

            <div className="h-full w-full flex flex-col items-center justify-center relative z-10 px-6">
              <div ref={carouselRef} className="max-w-lg -mt-16">
                {/* Highlight Badge */}
                {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[13px] font-medium mb-6">
                  {carouselContent[displaySlide].highlight}
                </div> */}

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