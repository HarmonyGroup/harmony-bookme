import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Image + Gradient Overlay using ::before */}
      <div className="absolute inset-0 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/80 before:to-primary/30 before:z-10 bg-[url('/assets/homepage-hero-background.jpg')] bg-cover bg-center z-0"></div>

      {/* Foreground content */}
      <div className="relative z-20 text-center max-w-4xl px-5">
        <h1 className="mb-5 text-4xl font-bold md:text-7xl/[80px]">
          Simplified Booking!
        </h1>
        <p className="text-white/80 text-sm md:text-base font-semibold mx-auto">
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
