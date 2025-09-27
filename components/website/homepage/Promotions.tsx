"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Promotions = () => {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto w-full max-w-7xl px-5">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4">
            <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="relative !h-fit p-5 md:p-6 rounded-xl overflow-hidden">
                <h1 className="relative text-white text-lg font-bold z-10 mb-6">
                  Your next adventure <br /> is just a click away
                </h1>
                <Link
                  href={"/"}
                  className="relative bg-white text-sky-800 text-xs font-semibold border border-white rounded-md px-4 py-2 z-10"
                >
                  Explore Now
                </Link>
                <Image
                  src={
                    "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
                  }
                  alt=""
                  fill
                  className="object-cover blur-[1px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-800/80 to-sky-800/65" />
              </div>
            </CarouselItem>

            <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="relative !h-fit p-5 md:p-6 rounded-xl overflow-hidden">
                <h1 className="relative text-white text-lg font-bold z-10 mb-6">
                  Book smart, save big <br /> on every experience
                </h1>
                <Link
                  href={"/"}
                  className="relative bg-white text-sky-800 text-xs font-semibold border border-white rounded-md px-4 py-2 z-10"
                >
                  Save Today
                </Link>
                <Image
                  src={
                    "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
                  }
                  alt=""
                  fill
                  className="object-cover blur-[1px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-800/80 to-sky-800/65" />
              </div>
            </CarouselItem>

            <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="relative !h-fit p-5 md:p-6 rounded-xl overflow-hidden">
                <h1 className="relative text-white text-lg font-bold z-10 mb-6">
                  Instant bookings, <br /> zero hassle guaranteed
                </h1>
                <Link
                  href={"/"}
                  className="relative bg-white text-sky-800 text-xs font-semibold border border-white rounded-md px-4 py-2 z-10"
                >
                  Book Now
                </Link>
                <Image
                  src={
                    "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
                  }
                  alt=""
                  fill
                  className="object-cover blur-[1px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-800/80 to-sky-800/65" />
              </div>
            </CarouselItem>

            <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="relative !h-fit p-5 md:p-6 rounded-xl overflow-hidden">
                <h1 className="relative text-white text-lg font-bold z-10 mb-6">
                  Exclusive deals <br /> and premium offers
                </h1>
                <Link
                  href={"/"}
                  className="relative bg-white text-sky-800 text-xs font-semibold border border-white rounded-md px-4 py-2 z-10"
                >
                  See Deals
                </Link>
                <Image
                  src={
                    "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
                  }
                  alt=""
                  fill
                  className="object-cover blur-[1px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-800/80 to-sky-800/65" />
              </div>
            </CarouselItem>

            <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="relative !h-fit p-5 md:p-6 rounded-xl overflow-hidden">
                <h1 className="relative text-white text-lg font-bold z-10 mb-6">
                  Premium experiences <br /> await your discovery
                </h1>
                <Link
                  href={"/"}
                  className="relative bg-white text-sky-800 text-xs font-semibold border border-white rounded-md px-4 py-2 z-10"
                >
                  Discover More
                </Link>
                <Image
                  src={
                    "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
                  }
                  alt=""
                  fill
                  className="object-cover blur-[1px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-800/80 to-sky-800/65" />
              </div>
            </CarouselItem>
          </CarouselContent>

          {/* Edge-positioned carousel controls */}
          <CarouselPrevious className="-left-2 -translate-x-2 text-primary bg-muted/90 hover:bg-muted/90 border-gray-200 shadow-lg cursor-pointer" />
          <CarouselNext className="-right-2 translate-x-2 text-primary bg-muted/90 hover:bg-muted/90 border-gray-200 shadow-lg cursor-pointer" />
        </Carousel>
      </div>
    </section>
  );
};

export default Promotions;