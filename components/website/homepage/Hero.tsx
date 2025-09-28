"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import BG from "@/public/assets/dreamy-atmosphere-pastel-colored-scene-travel-content.jpg";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const popularSearches = [
    "Concert in lagos",
    "Hotels in Abuja",
    "Cinemas in Port Harcourt",
  ];

  return (
    <div className="relative">
      {/* Main Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        {/* Background with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <Image
            src={BG}
            alt="Travel Background"
            fill
            priority
            className="object-cover scale-105 transition-transform duration-[10s] ease-out hover:scale-110"
            sizes="100vw"
          />
          <div className="hero-gradient-overlay" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/15 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute bottom-40 left-20 w-16 h-16 bg-white/15 rounded-full blur-lg animate-pulse delay-2000" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            {/* Main Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Bookings Made Easy
            </h1>

            <p className="text-[13px]/relaxed md:text-sm/relaxed text-white/85 font-medium mb-8 max-w-3xl mx-auto">
              Discover and book events, hotels, shortlets, movies, leisure
              activities <br className="hidden md:block" /> and travel in one
              seamless platform
            </p>
          </div>

          {/* Search Interface */}
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white backdrop-blur-lg border-0 shadow-2xl rounded-3xl p-4 md:p-6">
              <div className="">
                <div className="relative mb-4">
                  {/* <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.4"
                    stroke="currentColor"
                    className="size-[14px] text-gray-600 mt-[1px] absolute left-4 top-1/2 transform -translate-y-1/2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  <Input
                    placeholder="What're you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-10 !py-6 !text-xs font-normal placeholder:text-gray-700 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 border-0 shadow-none bg-muted/85 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-[16px] text-gray-600 mt-[1px] absolute left-4 top-1/2 transform -translate-y-1/2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>

                    <Input
                      placeholder="Where?"
                      className="ps-10 !py-6 !text-xs font-normal placeholder:text-gray-700 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 border-0 shadow-none bg-muted/85 rounded-xl"
                    />
                  </div>

                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="size-[16px] text-gray-600 mt-[1px] absolute left-4 top-1/2 transform -translate-y-1/2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                      />
                    </svg>

                    <Input
                      placeholder="When?"
                      className="ps-10 !py-6 !text-xs font-normal placeholder:text-gray-700 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 border-0 shadow-none bg-muted/85 rounded-xl"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs mb-3 text-gray-600">
                    Popular searches:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        className="bg-white text-sky-600 hover:bg-white hover:text-sky-800 text-xs rounded-md transition-all duration-300 cursor-pointer underline-offset-4 decoration-dashed"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.4"
                      stroke="currentColor"
                      className="size-[15px] mt-[1px]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                    Search
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;