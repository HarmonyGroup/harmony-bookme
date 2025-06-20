import React from "react";
import Link from "next/link";
import Image from "next/image";
import BG from "@/public/assets/homepage-hero-background.jpg";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <Image
          src={BG}
          alt="Harmony BookMe"
          fill
          priority
          className="hero-image blur-sm"
          sizes="100vw"
        />
      </div>

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
          href="/"
          className="flex items-center gap-2 text-white/80 text-sm md:text-base font-semibold border rounded-full px-5 py-2 mt-10"
        >
          Discover
        </Link>
      </div>
    </section>
  );
};

export default Hero;