"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  CalendarIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
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

            <p className="text-[13px]/relaxed md:text-sm/relaxed text-white/80 font-medium mb-8 max-w-3xl mx-auto">
              Find and book events, accommodations, movies, leisure activities{" "}
              <br /> and travel in one seamless platform
            </p>
          </div>

          {/* Search Interface */}
          <div className="max-w-5xl mx-auto">
            <Card className="bg-white backdrop-blur-lg border-0 shadow-2xl rounded-3xl p-4 md:p-6">
              <div className="">
                <div className="relative mb-4">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="What're you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-10 !py-6 !text-xs font-normal placeholder:text-gray-700 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 border-0 shadow-none bg-muted/80 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Where?"
                      className="ps-10 !py-6 !text-xs font-normal placeholder:text-gray-700 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 border-0 shadow-none bg-muted/80 rounded-xl"
                    />
                  </div>

                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="When?"
                      className="ps-10 !py-6 !text-xs font-normal placeholder:text-gray-700 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200 border-0 shadow-none bg-muted/80 rounded-xl"
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
                    className="w-full bg-primary hover:bg-inherit text-white text-[13px] font-semibold py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
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