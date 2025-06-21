import React from "react";
import Link from "next/link";
import Image from "next/image";

const VendorBanner = () => {
  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10 pt-0 md:pt-6 pb-20">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="vendor-banner-card p-5 md:p-6">
            <h1 className="relative text-white text-xl/snug md:text-2xl font-semibold z-10 mb-4">
              Need a <br /> vendor account?
            </h1>
            <Link
              href={"/auth/vendor/signup"}
              className="relative text-white text-sm md:text-base border rounded-full font-semibold z-10 px-3.5 py-1.5"
            >
              Get started
            </Link>
            <Image
              src={
                "https://img.freepik.com/free-photo/tropical-vacation-spot_23-2151982390.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
              }
              alt=""
              fill
              className="object-cover blur-[1px]"
            />
          </div>
          <div className="vendor-banner-card p-5 md:p-6">
            <h1 className="relative text-white text-xl/snug md:text-2xl font-semibold z-10 mb-4">
              Find explorers <br /> across the world
            </h1>
            <Image
              src={
                "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
              }
              alt=""
              fill
              className="object-cover blur-[1px]"
            />
          </div>
          <div className="vendor-banner-card p-5 md:p-6">
            <h1 className="relative text-white text-xl/snug md:text-2xl font-semibold z-10 mb-4">
              Manage <br /> bookings with ease
            </h1>
            <Image
              src={
                "https://img.freepik.com/free-photo/medium-shot-woman-working-by-pool_23-2151205516.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
              }
              alt=""
              fill
              className="object-cover blur-[1px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorBanner;