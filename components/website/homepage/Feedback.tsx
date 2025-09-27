"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel";

// Feedback data structure
const feedbackData = [
  {
    id: 1,
    name: "John Doe",
    role: "Property Manager",
    rating: 5,
    comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore deleniti aperiam ex laborum dolorem incidunt minima.",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Event Organizer",
    rating: 4,
    comment: "Exceptional service and attention to detail. The team went above and beyond to make our event memorable.",
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Explorer",
    rating: 5,
    comment: "Amazing experience! The platform made booking accommodations so easy and convenient.",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Business Owner",
    rating: 5,
    comment: "Outstanding customer support and seamless booking process. Highly recommended!",
  },
  {
    id: 5,
    name: "David Thompson",
    role: "Traveler",
    rating: 4,
    comment: "Great variety of options and competitive pricing. Will definitely use again.",
  },
  {
    id: 6,
    name: "Lisa Wang",
    role: "Event Planner",
    rating: 5,
    comment: "Professional service and excellent communication throughout the entire process.",
  },
];

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`size-[18px] ${
            index < rating ? "text-yellow-500" : "text-yellow-500/30"
          }`}
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};

// Feedback Card Component
const FeedbackCard = ({ feedback }: { feedback: typeof feedbackData[0] }) => {
  return (
    <div className="bg-muted rounded-xl p-4 h-full">
      <div className="space-y-1">
        <p className="text-primary text-[13px] font-semibold">
          {feedback.name}
        </p>
        <p className="text-gray-500 text-xs">{feedback.role}</p>
      </div>

      <p className="text-primary text-[13px] font-medium mt-4">
      &rdquo; {feedback.comment} &rdquo;
      </p>

      <div className="flex items-center gap-2 mt-4">
        <StarRating rating={feedback.rating} />
      </div>
    </div>
  );
};

const Feedback = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="">
          <h1 className="text-[#183264] text-base md:text-xl/tight font-semibold">
            Our Authentic Feedbacks!
          </h1>
          <div className="h-full w-full flex flex-col lg:flex-row gap-6 lg:gap-10 mt-10">
            {/* Rating Summary */}
            <div className="h-full flex flex-col justify-between gap-2 lg:min-w-[200px]">
              <div className="space-y-3">
                <p className="text-gray-600 text-xs whitespace-nowrap">
                  Customer Rating
                </p>
                <h2 className="text-primary text-2xl font-semibold">4.8/5</h2>
              </div>
              <p className="text-gray-600 text-xs">100+ satisfied customers</p>
            </div>

            {/* Carousel Container */}
            <div className="w-full relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full relative"
              >
                <CarouselContent className="-ml-4">
                  {feedbackData.map((feedback) => (
                    <CarouselItem
                      key={feedback.id}
                      className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <FeedbackCard feedback={feedback} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                {/* Edge-positioned carousel controls - Only Next button visible */}
                <CarouselNext className="-right-2 translate-x-2 text-primary bg-muted/90 hover:bg-muted/90 border-gray-200 shadow-lg cursor-pointer" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;