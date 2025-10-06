import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UseEmblaCarouselType } from "embla-carousel-react";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { LeisureListing } from "@/types/vendor/leisure";

const LeisureListingCard = ({ leisure }: { leisure: LeisureListing }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);

  // Listen for slide changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect(); // Set initial slide

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Reset slide when event changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [leisure?._id]);

  return (
    <div className="bg-white border border-muted rounded-xl duration-200 overflow-hidden group">
      {/* Image Carousel Section */}
      <div className="relative h-48 bg-gray-50 rounded-t-xl overflow-hidden">
        {leisure?.images && leisure.images.length > 0 ? (
          <>
            <Carousel className="w-full h-full" setApi={setApi}>
              <CarouselContent className="h-full">
                {leisure.images.map((image, index) => (
                  <CarouselItem key={index} className="h-full">
                    <div className="relative w-full h-48">
                      <Image
                        src={image}
                        alt={`${leisure?.title} - Image ${index + 1}`}
                        className="object-cover rounded-t-xl"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          console.log("Image failed to load:", image);
                          e.currentTarget.style.display = "none";
                        }}
                        loading="eager"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {leisure.images.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white text-primary hover:bg-white cursor-pointer border-0 outline-none shadow-sm z-10" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-primary hover:bg-white cursor-pointer border-0 outline-none shadow-sm z-10" />
                </>
              )}
            </Carousel>

            {/* Dot-style Carousel Indicators */}
            {leisure.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {leisure.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-white scale-125"
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Calendar className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Accommodation Content */}
      <div className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-primary text-[13px] line-clamp-1">
              {leisure?.title}
            </h3>

            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer outline-none ring-0 focus:ring-0 focus:outline-none hover:bg-muted/70 rounded-md p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="text-gray-600 size-[18px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link
                    className="w-full h-full flex items-center gap-2 text-gray-700 text-[12px]"
                    href={`/vendor/leisure/${leisure?.slug}/edit`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="text-gray-700 size-[15px]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    Edit
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-[11px]/relaxed text-gray-700 line-clamp-2 font-light">
            {leisure?.shortSummary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeisureListingCard;