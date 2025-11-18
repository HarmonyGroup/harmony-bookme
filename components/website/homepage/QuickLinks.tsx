"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import AccommodationsBG from "@/public/assets/accommodations-banner.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import KennyBlancBG from "@/public/assets/kennyblaqposter.png";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const QuickLinks = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);
  const bottomControlsRef = useRef<HTMLDivElement>(null);

  const items = [
    {
      title: "Top Picks",
      description: "Handpicked experiences and trending destinations just for you",
      image: KennyBlancBG,
    },
    {
      title: "Events",
      description: "Discover and book tickets to exclusive events this season",
      image:
        "https://img.freepik.com/free-photo/man-with-dreads-representing-rastafari-movement_23-2151532087.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740",
    },
    {
      title: "Shortlets",
      description: "Find your perfect short-term stay with fully furnished accommodations",
      image: AccommodationsBG,
    },
    {
      title: "Cinemas",
      description: "Catch the latest blockbusters and films in premium theaters",
      image:
        "https://img.freepik.com/free-photo/3d-view-couple-cinema-watching-movie_23-2151016104.jpg?t=st=1763418374~exp=1763421974~hmac=ff676c895a37769266304c2e2d6704d0d414bf003e45131b937b4d807f9370b2&w=2000",
    },
    {
      title: "Leisure",
      description: "Unwind with exciting activities, and relaxation experiences",
      image:
        "https://img.freepik.com/free-photo/couple-riding-their-bikes-beach_23-2150815919.jpg?t=st=1763420254~exp=1763423854~hmac=500b4bc80749bb1d3e672b364f4c19db3a6008e99c4436c1f188cde864bde29d&w=1480",
    },
    // {
    //   title: "Conference",
    //   description:
    //     "Join industry leaders for insightful conferences and networking",
    //   image:
    //     "https://img.freepik.com/free-photo/women-s-panel-discussion_23-2151932835.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_items_boosted&w=740",
    // },
    // {
    //   title: "Wellness",
    //   description:
    //     "Stay active with fitness classes and wellness retreats",
    //   image:
    //     "https://img.freepik.com/free-photo/view-children-practicing-health-wellness-activity_23-2151402036.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740",
    // },
    // {
    //   title: "Workshops",
    //   description: "Learn new skills through workshops and classes",
    //   image:
    //     "https://img.freepik.com/premium-photo/man-speaking-front-large-audience_1276913-30195.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_items_boosted&w=740",
    // },
    // {
    //   title: "Games",
    //   description:
    //     "Compete in exciting games and tournaments for all ages",
    //   image:
    //     "https://img.freepik.com/free-photo/portrait-athlete-competing-olympic-games-tournament_23-2151470915.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_items_boosted&w=740",
    // },
    // {
    //   title: "Religious",
    //   description:
    //     "Participate in spiritual events and religious gatherings",
    //   image:
    //     "https://img.freepik.com/premium-photo/woman-sits-pew-church-congregation-with-altar-other-attendees-backg_924727-83293.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_items_boosted&w=740",
    // },
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());
    setTotalSlides(api.scrollSnapList().length);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setTotalSlides(api.scrollSnapList().length);
    });

    api.on("reInit", () => {
      setTotalSlides(api.scrollSnapList().length);
    });
  }, [api]);

  useGSAP(
    () => {
      // Set initial states for header elements only
      gsap.set(
        [titleRef.current, controlsRef.current, indicatorsRef.current, bottomControlsRef.current],
        {
          opacity: 0,
          y: 40,
        }
      );

      // Set carousel container initial state (only y position, keep visible)
      if (carouselRef.current) {
        gsap.set(carouselRef.current, {
          y: 40,
        });
      }

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      // Animate title
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      })
        // Animate controls (top right)
        .to(
          controlsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        // Animate carousel container (just y position, keep opacity at 1)
        .to(
          carouselRef.current,
          {
            y: 0,
            duration: 0.8,
          },
          "-=0.3"
        )
        // Animate indicators
        .to(
          indicatorsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        // Animate bottom controls
        .to(
          bottomControlsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.4"
        );
    },
    { scope: sectionRef }
  );


  return (
    <section ref={sectionRef} className="bg-white py-14">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        {/* Header with controls on large screens */}
        <div className="flex items-center justify-center lg:justify-between mb-10 md:mb-12">
          <h1 ref={titleRef} className="text-primary text-center text-lg md:text-xl/tight md:text-left font-semibold">
            Discover exclusive offers
          </h1>

          {/* Carousel controls - top right on large screens */}
          <div ref={controlsRef} className="hidden lg:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-primary"
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="size-5" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-primary"
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className="size-5" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div ref={carouselRef}>
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 lg:-ml-4">
              {items.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 lg:pl-4 basis-[85%] sm:basis-[75%] lg:basis-1/3"
                >
                <Link href="/" className="cursor-pointer block">
                  <article className="quick-link-card group !rounded-2xl overflow-hidden h-full">
                    <Image
                      alt={item.title}
                      src={item.image}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="eager"
                      fill
                      priority={index < 3}
                    />
                    <div className="relative pt-40">
                      <div className="p-5">
                        <h1 className="text-white text-xs md:text-base font-semibold mb-1 duration-300">
                          {item.title}
                        </h1>
                        <p className="text-white/80 text-[13px]/normal transition-transform duration-300 max-w-[80%] line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        </div>

        {/* Carousel indicators - bottom on large screens */}
        {totalSlides > 0 && (
          <div ref={indicatorsRef} className="hidden lg:flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === index
                    ? "w-8 bg-primary"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Carousel controls - bottom on small screens */}
        <div ref={bottomControlsRef} className="flex lg:hidden items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            className="size-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-primary"
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeft className="size-5" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-primary"
            onClick={() => api?.scrollNext()}
          >
            <ChevronRight className="size-5" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;