// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import EventBanner from "@/public/assets/sample-shortlet.jpg";
// import { RxDividerVertical } from "react-icons/rx";
// import { AccommodationListing } from "@/types/accommodation";
// import { formatPrice } from "@/lib/utils";

// interface AccommodationCardProps {
//   accommodation: AccommodationListing;
// }

// const AccommodationCard = ({ accommodation }: AccommodationCardProps) => {
//   const [isSaved, setIsSaved] = useState(false);

//   return (
//     <div className="block rounded-lg relative">
//       <div className="absolute top-2.5 left-2.5 bg-white flex items-center gap-1 text-primary text-xs font-semibold rounded px-2 py-1">
//         4.8
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 24 24"
//           fill="currentColor"
//           className="text-yellow-500 size-[14px] -mt-[2px]"
//         >
//           <path
//             fillRule="evenodd"
//             d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </div>
//       <Button
//         onClick={() => setIsSaved(!isSaved)}
//         className="absolute right-0 top-0 bg-inherit hover:bg-inherit cursor-pointer"
//       >
//         {isSaved ? (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             className="text-red-500 size-6"
//           >
//             <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
//           </svg>
//         ) : (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             className="size-6"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
//             />
//           </svg>
//         )}
//       </Button>
//       <Image
//         alt=""
//         src={EventBanner}
//         className="h-56 w-full rounded-t-lg object-cover"
//       />
//       <div className="bg-white rounded-b-lg py-4">
//         <h3 className="text-primary text-xs font-semibold">
//           {accommodation?.title}
//         </h3>
//         <p className="text-gray-600 text-xs mt-2">
//           {accommodation?.city}, {accommodation?.state}
//         </p>
//         <div className="flex items-center gap-1 mt-2">
//           <p className="text-gray-600 text-xs">
//             {accommodation?.bedrooms} beds
//           </p>
//           <RxDividerVertical className="text-gray-600" />
//           <p className="text-gray-600 text-xs">
//             {accommodation?.bathrooms} baths
//           </p>
//           <RxDividerVertical className="text-gray-600" />
//           <p className="text-gray-600 text-xs">
//             {accommodation?.parkingSpaces} parking
//           </p>
//         </div>
//         <div className="flex items-center justify-between text-primary text-xs md:text-[13px] font-semibold mt-4">
//           <p>NGN {formatPrice(accommodation?.basePrice)}</p>
//           <Link
//             href={"/accommodations/sample"}
//             className="flex items-center gap-1.5 bg-white hover:bg-primary text-primary hover:text-white text-xs font-semibold border border-primary rounded-full px-2.5 py-1.5 transition duration-300"
//           >
//             Book Now
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccommodationCard;

import React, { useState, useEffect } from "react";
import { AccommodationListing } from "@/types/accommodation";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

interface AccommodationCardProps {
  accommodation: AccommodationListing;
}

const AccommodationCard = ({ accommodation }: AccommodationCardProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);

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

  // Reset slide when accommodation changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [accommodation?._id]);

  return (
    <div className="grid grid-cols-3 border border-gray-200/80 shadow-xs rounded-lg overflow-hidden bg-white transition-colors ease-in-out duration-300">
      <div className="relative col-span-1 h-52 bg-gray-50 overflow-hidden">
        <Carousel className="w-full h-full" setApi={setApi}>
          <CarouselContent>
            {accommodation?.images?.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-52">
                  <Image
                    src={image}
                    alt={`${accommodation?.title} - Image ${index + 1}`}
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

        {/* Accommodation Type Badge */}
        <div className="absolute top-2 right-2 bg-white/90 text-primary text-xs font-semibold rounded-sm px-2 py-1 capitalize">
          {accommodation?.accommodationType}
        </div>

        {/* Carousel Indicator */}
        {accommodation?.images && accommodation.images.length > 1 && (
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium rounded-sm px-2 py-1">
            {currentSlide + 1} / {accommodation.images.length}
          </div>
        )}
        {/* <div className="absolute top-2 left-2 bg-white flex items-center gap-1 text-primary text-xs font-semibold rounded-sm px-2 py-1">
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
      </div>
      <div className="col-span-2 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-primary text-base font-semibold">
              {accommodation?.title}
            </h1>
            {/* <div className="flex items-center gap-2">
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
            </div> */}
          </div>
          <div className="flex items-center gap-2.5 mt-2.5">
            <div className="flex items-center gap-2">
              <div className="text-gray-800 text-[12px] font-medium">
                {accommodation?.bedrooms} Beds
              </div>
            </div>
            <span className="text-gray-700 text-xs">|</span>
            <div className="flex items-center gap-2">
              <div className="text-gray-800 text-[12px] font-medium">
                {accommodation?.bathrooms} Baths
              </div>
            </div>
            <span className="text-gray-700 text-xs">|</span>
            <div className="flex items-center gap-2">
              <div className="text-gray-800 text-[12px] font-medium">
                {accommodation?.parkingSpaces} Parking
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2 mt-2.5">
            {accommodation?.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          {/* <div className="flex items-center gap-1">
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
              {accommodation?.city}, {accommodation?.state}
            </span>
          </div> */}
          <p className="text-gray-500 text-[11px]">prices from <span className="text-primary text-[15px] font-semibold">NGN 245,000</span></p>
          <div className="flex items-center gap-2.5">
            <Link
              href={`/accommodations/${accommodation?.slug}`}
              className="bg-primary text-white text-xs font-medium rounded-md px-4 py-2 hover:bg-primary/90 transition-colors ease-in-out duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;