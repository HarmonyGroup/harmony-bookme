"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const Promotions = () => {
  const [current, setCurrent] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!carouselApi) return;

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Define the promotion items as an array for easier management
  const promotionItems = [
    {
      title: "Your next adventure is just a click away",
      buttonText: "Explore Now",
      href: "/",
    },
    {
      title: "Book smart, save big on every experience",
      buttonText: "Save Today",
      href: "/",
    },
    {
      title: "Instant bookings, zero hassle guaranteed",
      buttonText: "Book Now",
      href: "/",
    },
    {
      title: "Exclusive deals and premium offers",
      buttonText: "See Deals",
      href: "/",
    },
    {
      title: "Premium experiences await your discovery",
      buttonText: "Discover More",
      href: "/",
    },
  ];

  return (
    <section className="bg-white pb-14 pt-4 md:pt-10">
      <div className="mx-auto w-full max-w-7xl px-4">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4">
            {promotionItems.map((item, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="relative !h-fit px-5 py-8 md:px-6 rounded-xl overflow-hidden">
                  <h1 className="relative text-white text-lg font-bold z-10 mb-6">
                    {item.title.split(' ').map((word, wordIndex, words) => (
                      <React.Fragment key={wordIndex}>
                        {word}
                        {wordIndex === Math.floor(words.length / 2) - 1 ? <br /> : ' '}
                      </React.Fragment>
                    ))}
                  </h1>
                  <Link
                    href={item.href}
                    className="relative bg-white text-sky-800 text-xs font-semibold border border-white rounded-lg px-4 py-2 z-10"
                  >
                    {item.buttonText}
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
            ))}
          </CarouselContent>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {promotionItems.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === current
                    ? "bg-primary w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => {
                  carouselApi?.scrollTo(index);
                }}
              />
            ))}
          </div>

          {/* Edge-positioned carousel controls */}
          {/* <CarouselPrevious className="-left-2 -translate-x-2 text-primary bg-muted/90 hover:bg-muted/90 border-gray-200 shadow-lg cursor-pointer" /> */}
          {/* <CarouselNext className="-right-2 translate-x-2 text-primary bg-muted/90 hover:bg-muted/90 border-gray-200 shadow-lg cursor-pointer" /> */}
        </Carousel>
      </div>
    </section>
  );
};

export default Promotions;