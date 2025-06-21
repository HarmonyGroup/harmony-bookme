"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Page = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
          },
        }
      );
    }

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
          },
          delay: 0.4
        }
      );
    }
  }, []);

  return (
    <div>
      <section className="relative h-[50vh] w-full bg-primary flex flex-col items-center justify-center overflow-x-hidden">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
          <Image
            src={
              "https://img.freepik.com/free-photo/smiling-customer-service-agent_23-2151933129.jpg?uid=R137948985&amp;ga=GA1.1.1977978369.1744267390&amp;semt=ais_hybrid&amp;w=740"
            }
            layout="fill"
            objectFit="cover"
            alt="Harmony BookMe"
            className="blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-primary/60"></div>
          <div
            className="relative flex flex-col items-center justify-center"
            ref={heroRef}
          >
            <h1 className="mb-5 text-white text-center text-4xl font-bold md:text-4xl/snug max-w-xl">
              Join our team
            </h1>
          </div>
        </div>
      </section>

      <section>
        <div
          className="mx-auto w-full min-h-[60vh] h-full max-w-7xl px-4 py-16"
          ref={contentRef}
        >
          <h3 className="text-primary text-base md:text-lg/tight font-semibold">
            See current openings
          </h3>
          <p className="text-gray-600 text-xs/relaxed mt-6 max-w-xl">
            We&apos;re not hiring right now, but we&apos;re always excited to
            connect with passionate people. Feel free to reach out to our HR
            team at <span className="font-semibold">hr@harmonybookme.com</span>{" "}
            to learn more about our culture and future opportunities.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Page;