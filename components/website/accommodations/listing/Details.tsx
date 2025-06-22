import React from "react";
import { LuBedDouble, LuBath } from "react-icons/lu";
import { IoCarOutline } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";

const Details = () => {
  return (
    <div className="space-y-5 md:space-y-6">
      <div>
        <h1 className="text-primary text-xs sm:text-sm font-semibold">
          De Aries Apartments
        </h1>
        <p className="text-gray-600 text-[11px] sm:text-xs mt-1 sm:mt-2">
          4 bedrooms | 2 bath | 3 parking | WiFi
        </p>
      </div>

      <div>
        <h3 className="text-primary text-xs font-semibold">Description</h3>
        <p className="text-gray-600 text-[11px]/relaxed sm:text-xs/relaxed line-clamp-3 mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
          exercitationem explicabo necessitatibus quos beatae dolore repudiandae
          corporis cupiditate. Perspiciatis consequuntur aliquid ipsa dicta
          beatae ipsum doloremque fuga laudantium tenetur doloribus. Lorem ipsum
          dolor sit amet consectetur, adipisicing elit. Enim temporibus modi
          omnis nulla ipsum quae. Vel repellat ipsam incidunt nostrum.
          Voluptatem laudantium voluptatum sit placeat corrupti soluta
          veritatis, dolorem dolor.
        </p>
      </div>

      <div>
        <h3 className="text-primary text-xs font-semibold">
          What this space offers
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 mb-4">
          <div className="flex flex-col items-center justify-center gap-1.5 border rounded-lg p-6">
            <div className="bg-gray-100 size-10 sm:size-12 flex items-center justify-center rounded-full">
              <LuBedDouble className="text-gray-600 text-lg sm:text-xl" />
            </div>
            <p className="text-xs mt-2">4 beds</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 border rounded-lg p-6">
            <div className="bg-gray-100 size-10 sm:size-12 flex items-center justify-center rounded-full">
              <LuBath className="text-gray-600 text-lg sm:text-xl" />
            </div>
            <p className="text-xs mt-2">2 bath</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 border rounded-lg p-6">
            <div className="bg-gray-100 size-10 sm:size-12 flex items-center justify-center rounded-full">
              <IoCarOutline className="text-gray-600 text-lg sm:text-xl" />
            </div>
            <p className="text-xs mt-2">2 parking</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 border rounded-lg p-6">
            <div className="bg-gray-100 size-10 sm:size-12 flex items-center justify-center rounded-full">
              <BsPerson className="text-gray-600 text-lg sm:text-xl" />
            </div>
            <p className="text-xs mt-2">2 max guests</p>
          </div>
        </div>
        {/* <Link
          href={"/"}
          className="flex items-center gap-1.5 text-primary text-[11px] font-semibold"
        >
          See all 22 amenities
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="size-[11px] mt-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link> */}
      </div>

      <div>
        <h3 className="text-primary text-xs font-semibold">
          Where you&apos;ll be
        </h3>
        <div className="w-full mt-4">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.2216952253775!2d3.381955600998506!3d6.493590264965907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8c8860f588fb%3A0xd8a3d94f7d4ca235!2sBlue%20Intercontinental%20Microfinance%20Bank!5e0!3m2!1sen!2sng!4v1749903693966!5m2!1sen!2sng"
            width="100%"
            height="450"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Details;
