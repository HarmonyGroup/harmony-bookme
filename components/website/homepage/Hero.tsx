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

      <div className="hero-content">
        <h1 className="hero-title">Simplified Booking!</h1>
        <p className="hero-description">
          We&apos;ve built a platform where you can book everything—from
          electrifying concerts and must-see movies to essential rentals and
          unforgettable getaways.
        </p>
        <Link href="/" className="hero-button">
          Discover
        </Link>
      </div>
    </section>
  );
};

export default Hero;
