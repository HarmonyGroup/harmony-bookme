import React from "react";
import Link from "next/link";
import Image from "next/image";
import BG from "@/public/assets/homepage-hero-background.jpg";

const Hero = () => {
  return (
    <section className="relative h-[90vh] w-full bg-primary flex flex-col items-center justify-center overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <Image src={BG} layout="fill" objectFit="cover" alt="Harmony BookMe" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-primary/30"></div>
        <div className="relative flex flex-col items-center justify-center">
          <h1 className="mb-5 text-white text-center text-4xl font-bold md:text-7xl/[80px]">
            Simplified Booking!
          </h1>
          <p className="text-center text-white/80 text-sm/relaxed md:text-base/relaxed font-semibold mx-auto max-w-3xl">
            We&apos;ve built a platform where you can book everything—from
            electrifying concerts and must-see movies to essential rentals and
            unforgettable getaways.
          </p>
          <Link
            href={"/"}
            className="flex items-center gap-2 text-white/80 text-sm md:text-base font-semibold border rounded-full px-5 py-2 mt-10"
          >
            Discover
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;