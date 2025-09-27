"use client";

import React, { useState } from "react";
import EventBanner from "@/public/assets/sample-shortlet.jpg";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { FaStar } from "react-icons/fa6";
// import { FaCircle } from "react-icons/fa";
// import { TimerIcon } from "@phosphor-icons/react";
import { Movie } from "@/types/vendor/movies-and-cinema";
import { formatMovieDuration } from "@/lib/utils";

interface IParams {
  movie: Movie;
}

const ExploreMoviesCard = ({ movie }: IParams) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    // <article className="flex bg-white transition hover:shadow-xl rounded-lg overflow-hidden">
    //   {/*  */}

    //   <div className="hidden sm:block sm:basis-56">
    //     <img
    //       alt=""
    //       src="https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
    //       className="aspect-square h-full w-full object-cover"
    //     />
    //   </div>

    //   <div className="flex flex-1 flex-col justify-between">
    //     <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
    //       <div className="flex items-center gap-2 mb-2">
    //         <span className="text-primary text-[11px] font-medium">2025</span>
    //         <FaCircle size={3} color="#183264" />
    //         <span className="text-primary text-[11px] font-medium">Drama</span>
    //         <FaCircle size={3} color="#183264" />
    //         <span className="text-primary text-[11px] font-medium">
    //           2h 30min
    //         </span>
    //       </div>
    //       <a href="#">
    //         <h3 className="text-primary text-sm font-medium">The Last Rodeo</h3>
    //       </a>

    //       <p className="mt-2 line-clamp-2 text-xs/relaxed text-gray-500 font-normal">
    //         Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae
    //         dolores, possimus pariatur animi temporibus nesciunt praesentium
    //         dolore sed nulla ipsum eveniet corporis quidem, mollitia itaque
    //         minus soluta, voluptates neque explicabo tempora nisi culpa eius
    //         atque dignissimos. Molestias explicabo corporis voluptatem?
    //       </p>

    //       <div className="space-y-2 mt-4">
    //         <div className="flex items-center gap-1.5">
    //           <div className="size-4 rounded-full bg-primary text-white text-[11px] font-medium flex items-center justify-center">
    //             G
    //           </div>
    //           <p className="text-primary text-xs font-normal">
    //             Genesis Cinemas Lekki
    //           </p>
    //         </div>
    //         <div className="inline-flex text-primary text-xs font-normal border border-dashed border-primary/80 rounded-md px-2.5 py-2 mt-3">
    //           Sept 4 at 09:45
    //         </div>
    //       </div>

    //       {/* <Button className="bg-inherit hover:bg-inherit text-primary text-xs shadow-none p-0">Read more</Button> */}
    //     </div>

    //     <div className="sm:flex sm:items-end sm:justify-end">
    //       {/* <div className="space-y-1.5">
    //         <p className="text-primary text-xs font-medium">Genesis Cinemas Lekki</p>
    //         <p className="text-primary text-xs font-medium"> Tomorrow 09:45</p>
    //         </div> */}
    //       <a
    //         href="#"
    //         className="block bg-primary px-5 py-3 text-center text-xs font-bold text-white uppercase transition"
    //       >
    //         BUY TICKETS
    //       </a>
    //     </div>
    //   </div>
    // </article>
    // <article className="relative bg-white rounded-lg p-6">
    //   <Button className="absolute bottom-3 right-3 text-white text-xs font-semibold shadow-none rounded-full h-fit !py-2">
    //     Buy Tickets
    //   </Button>
    //   <div className="relative size-24 bg-gray-200 rounded-lg -mt-20 overflow-hidden shadow-lg">
    //     <Image
    //       alt=""
    //       src={CinemaImage}
    //       className="w-full rounded-lg object-cover mb-5"
    //     />
    //   </div>
    //   <h2 className="text-primary text-sm font-semibold mt-8">
    //     Ebony Life Cinema
    //   </h2>
    //   <p className="text-gray-500 text-xs mt-1.5">
    //     Monday to Friday 09:00 - 24:00
    //   </p>
    //   <div className="flex items-center gap-1 text-primary text-xs font-semibold rounded mt-4">
    //     4.8
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       viewBox="0 0 24 24"
    //       fill="currentColor"
    //       className="text-yellow-500 size-[14px] -mt-[2px]"
    //     >
    //       <path
    //         fillRule="evenodd"
    //         d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
    //         clipRule="evenodd"
    //       />
    //     </svg>
    //   </div>
    // </article>

    <div className="block rounded-lg relative">
      {/* <div className="absolute top-2.5 left-2.5 bg-white flex items-center gap-1 text-primary text-xs font-semibold rounded px-2 py-1">
        4.8
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-yellow-500 size-[14px] -mt-[2px]"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clipRule="evenodd"
          />
        </svg>
      </div> */}
      <Button
        onClick={() => setIsSaved(!isSaved)}
        className="absolute right-0 top-0 bg-inherit hover:bg-inherit cursor-pointer"
      >
        {isSaved ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-red-500 size-6"
          >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        )}
      </Button>
      <Image
        alt=""
        src={EventBanner}
        className="h-60 w-full rounded-lg object-cover mb-5"
      />
      <h3 className="text-primary text-sm font-semibold mt-4 sm:mt-3.5">
        {movie?.title}
      </h3>
      <div className="flex items-center gap-2 mt-2">
        <p className="text-gray-500 text-xs">{movie?.genre?.[0]}</p>
        <p className="text-gray-500 text-xs">|</p>
        <p className="text-gray-500 text-xs">
          {formatMovieDuration(movie?.duration)}
        </p>
        <p className="text-gray-500 text-xs">|</p>
        <p className="text-gray-500 text-xs">{movie?.rating}</p>
      </div>
      <div className="flex items-center justify-between text-primary font-semibold mt-6">
        <div className="space-y-1">
          <p className="text-primary text-xs">{movie?.cinema?.title}</p>
          <p className="text-gray-500 text-[11px] font-normal">
            {movie?.cinema?.city}, {movie?.cinema?.state}
          </p>
        </div>
        <Link
          href={`/movies/${movie?.slug}`}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/85 text-white text-[12px] font-semibold rounded-lg px-3 py-1.5 transition duration-300"
        >
          Buy Ticket
        </Link>
      </div>
    </div>
  );
};

export default ExploreMoviesCard;