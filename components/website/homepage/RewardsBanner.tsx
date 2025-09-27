import React from "react";
import Link from "next/link";
import Image from "next/image";

const RewardsBanner = () => {
  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-5">
        <div className="bg-muted border-gray-200 flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between gap-6 rounded-xl p-6 py-8 md:py-6">
          <div className="flex flex-col items-center md:items-start justify-center md:justify-start">
            <h1 className="text-primary text-base/relaxed md:text-xl/relaxed font-semibold">
              Earn rewards with every booking
            </h1>
            <p className="text-gray-500 text-xs/relaxed md:text-[13px] text-center font-normal mt-1.5 mb-4">
              Book concerts, nightlife, or shortlets and get points for
              discounts, gift cards, and exclusive offers
            </p>
            <Link
              href={"/"}
              className="bg-primary border border-primary text-white text-xs md:text-[13px] font-semibold rounded-lg px-4 py-2.5"
            >
              Get started
            </Link>
          </div>
          <Image
            alt="Harmony BookMe"
            src={
              "https://cdn-icons-png.freepik.com/256/9091/9091271.png?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid"
            }
            className="size-14 md:size-20 object-cover rounded-lg -order-1 md:order-1"
            width={80}
            height={80}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default RewardsBanner;