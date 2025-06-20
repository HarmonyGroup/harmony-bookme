import React from "react";
import Link from "next/link";
import Image from "next/image";
import BG from "@/public/assets/homepage-hero-background.jpg";

const Hero = () => {
  return (
    <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={BG}
          alt="Harmony BookMe"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-primary/30"></div>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-10 text-center">
        <h1 className="mb-5 text-white text-4xl font-bold md:text-7xl/[80px]">
          Simplified Booking!
        </h1>
        <p className="text-white/80 text-sm md:text-base font-semibold mx-auto max-w-3xl">
          We&apos;ve built a platform where you can book everything—from
          electrifying concerts and must-see movies to essential rentals and
          unforgettable getaways.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 text-sm md:text-base font-semibold border rounded-full px-5 py-2 mt-10"
        >
          Discover
        </Link>
      </div>
    </section>
  );
};

export default Hero;