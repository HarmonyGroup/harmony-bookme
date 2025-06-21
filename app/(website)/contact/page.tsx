"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Page = () => {
  const heroRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
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

    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        }
      );
    });
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
              Need help? <br /> We&apos;re just a click away.
            </h1>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full h-full max-w-7xl px-4 py-16">
          <h3 className="text-primary text-base md:text-lg/tight font-semibold">
            We&apos;d love to hear from you
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
            {[
              {
                title: "24/7 Help Center",
                desc: "Got a question about a booking? Need help with the app? Our support team is always here for you.",
                href: "/help-center",
                btn: "Visit Help Center",
              },
              {
                title: "Vendor Support",
                desc: "Questions about setting up your vendor profile, receiving payments, or managing bookings? We&apos;ve got answers.",
                href: "/vendor-support",
                btn: "Explore Vendor Help",
              },
              {
                title: "Talk to Sales",
                desc: "Want to partner with us or launch a campaign? Our sales team is ready to work with you.",
                href: "/contact-sales",
                btn: "Contact Sales",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="h-60 bg-blue-100/35 flex flex-col items-start justify-between rounded-xl p-6"
                ref={(el: HTMLDivElement | null) => {
                  cardsRef.current[i] = el;
                }}
              >
                <div>
                  <h3 className="text-primary text-sm font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs/relaxed mt-3">
                    {item.desc}
                  </p>
                </div>
                <Link
                  href={item.href}
                  className="text-primary text-xs font-medium border border-primary rounded-full px-3.5 py-2 hover:bg-primary hover:text-white transition-all ease-in-out duration-300"
                >
                  {item.btn}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;