import React, { useState } from "react";
import { Movie } from "@/types/vendor/movies-and-cinema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatMovieDuration } from "@/lib/utils";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="grid grid-cols-3 border border-gray-200/80 shadow-xs rounded-lg overflow-hidden bg-white transition-colors ease-in-out duration-300">
      <div className="relative col-span-1 h-52 bg-gray-50 overflow-hidden">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {movie?.images?.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-52">
                  <Image
                    src={image}
                    alt={`${movie?.title} - Image ${index + 1}`}
                    className="object-cover"
                    fill
                    priority={index === 0}
                    loading="eager"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white cursor-pointer" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white cursor-pointer" />
        </Carousel>
      </div>

      <div className="col-span-2 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-primary text-base font-semibold">
              {movie?.title}
            </h1>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsSaved(!isSaved)}
                className="bg-inherit cursor-pointer !h-9 !w-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors ease-in-out duration-300"
              >
                {isSaved ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-red-500 size-[22px]"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.2"
                    stroke="currentColor"
                    className="text-gray-600 size-[22px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2.5 mt-2.5">
            <div className="flex items-center gap-2">
              <div className="text-gray-800 text-[12px] font-medium">
                {movie?.genre?.[0]}
              </div>
            </div>
            <span className="text-gray-700 text-xs">|</span>
            <div className="flex items-center gap-2">
              <div className="text-gray-800 text-[12px] font-medium">
                {formatMovieDuration(movie?.duration)}
              </div>
            </div>
            <span className="text-gray-700 text-xs">|</span>
            <div className="flex items-center gap-2">
              <div className="text-gray-800 text-[12px] font-medium">
                {movie?.rating}
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2 mt-2.5">
            {movie?.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-primary size-[14px]"
            >
              <path
                fillRule="evenodd"
                d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-primary text-xs font-medium">
              {movie?.cinema?.title}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href={`/movies/${movie?.slug}`}
              className="bg-primary text-white text-xs font-medium rounded-md px-4 py-2 hover:bg-primary/90 transition-colors ease-in-out duration-300"
            >
              Buy Tickets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;