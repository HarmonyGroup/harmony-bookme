"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BG from "@/public/assets/homepage-hero-background.jpg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Page = () => {
  const heroRef = useRef(null);
  const introRef = useRef(null);
  const valuesRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-badge",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );

      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.4 }
      );

      gsap.fromTo(
        ".intro-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".values-title",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".value-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        ".cta-content",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div>
      <section
        ref={heroRef}
        className="relative h-[60vh] w-full bg-primary flex flex-col items-center justify-center overflow-x-hidden"
      >
        <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
          <Image
            src={BG}
            layout="fill"
            objectFit="cover"
            alt="Harmony BookMe"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-primary/60"></div>
          <div className="relative flex flex-col items-center justify-center">
            <p className="hero-badge text-gray-100 text-sm font-semibold mb-4">
              ABOUT US
            </p>
            <h1 className="hero-title mb-5 text-white text-center text-2xl font-bold md:text-4xl/[45px] md:max-w-[50%]">
              We are building a community of explorers and vendors
            </h1>
          </div>
        </div>
      </section>

      {/* <section ref={introRef} className="bg-blue-50/50">
        <div className="mx-auto w-full h-full max-w-7xl px-4 py-16">
          <div className="intro-content">
            <h3 className="text-[#183264] text-lg md:text-xl/tight font-medium">
              Booking made simple for everyone
            </h3>
            <p className="text-gray-600 text-[13px]/relaxed max-w-3xl mt-5 mb-6">
              Our platform connects passionate explorers with trusted vendors
              across the globe. From unforgettable events and movie experiences
              to cozy short-let apartments and thrilling recreational
              activities, we make discovering and booking your next adventure
              effortless and secure.
            </p>
            <Link
              href={"/"}
              className="inline-flex items-center gap-1.5 text-white text-[13px] font-medium bg-primary rounded-full px-4 py-2.5 hover:bg-primary/90 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </section> */}

      <section
        ref={valuesRef}
        className="mx-auto w-full h-full max-w-7xl px-4 py-20"
      >
        <h3 className="values-title text-[#183264] text-center text-lg md:text-2xl/tight font-medium">
          What we stand for
        </h3>
        <p className="max-w-lg text-gray-600 text-[13px]/relaxed font-medium text-center mx-auto mt-4">
          Events, movies, accommodations, leisure—organize your bookings in just
          a few clicks with the all-in-one platform everyone can use.
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6 mt-14">
          <div className="value-card bg-gray-50 rounded-lg p-6 hover:bg-gray-100/70 transition-colors cursor-pointer">
            <div className="size-8 flex items-center justify-center bg-primary text-white text-[13px] font-semibold rounded">
              01
            </div>
            <h3 className="text-primary text-sm font-medium mt-4">
              Transparency
            </h3>
            <p className="text-xs/relaxed text-gray-600 line-clamp-3 mt-2">
              We believe in honest pricing, clear policies, and open
              communication. Every booking comes with detailed information,
              verified reviews, and transparent terms so you always know what to
              expect.
            </p>
          </div>
          <div className="value-card bg-gray-50 rounded-lg p-6 hover:bg-gray-100/70 transition-colors cursor-pointer">
            <div className="size-8 flex items-center justify-center bg-primary text-white text-[13px] font-semibold rounded">
              02
            </div>
            <h3 className="text-primary text-sm font-medium mt-4">
              Community Driven
            </h3>
            <p className="text-xs/relaxed text-gray-600 line-clamp-3 mt-2">
              Our platform thrives on the connections between explorers and
              vendors. We foster meaningful relationships, encourage authentic
              reviews, and support local businesses to create a vibrant global
              community.
            </p>
          </div>
          <div className="value-card bg-gray-50 rounded-lg p-6 hover:bg-gray-100/70 transition-colors cursor-pointer">
            <div className="size-8 flex items-center justify-center bg-primary text-white text-[13px] font-semibold rounded">
              03
            </div>
            <h3 className="text-primary text-sm font-medium mt-4">
              Trust & Safety
            </h3>
            <p className="text-xs/relaxed text-gray-600 line-clamp-3 mt-2">
              Every vendor is verified, every payment is protected, and every
              experience is backed by our commitment to your safety. We use
              advanced security measures to ensure peace of mind for all users.
            </p>
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="bg-gray-100/70 py-14">
        <div className="mx-auto w-full h-full max-w-7xl px-4">
          <div className="cta-content bg-white flex flex-col md:flex-row items-center justify-between p-6 rounded-lg shadow-md gap-4">
            <div>
              <h3 className="text-primary text-base md:text-xl/tight text-center md:text-left font-medium">
                Let&apos;s do great things together
              </h3>
              <p className="text-gray-600 text-xs/relaxed md:text-[13px]/relaxed text-center md:text-left font-normal mt-2">
                Join us to create something impactful and meaningful
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup?type=explorer"
                className="inline-block bg-primary border border-primary px-6 py-3 font-medium text-white text-xs md:text-[13px] rounded-full hover:bg-primary/90 transition-colors duration-300"
              >
                See open positions
              </Link>
              {/* <Link
                href="/signup?type=vendor"
                className="inline-block bg-white border border-primary px-6 py-3 font-medium text-primary text-[13px] rounded-full hover:bg-gray-50 transition-colors"
              >
                Become a Vendor
              </Link> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
