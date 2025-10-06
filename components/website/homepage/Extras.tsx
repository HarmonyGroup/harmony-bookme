import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Extras = () => {
  return (
    <section>
      <div className="mx-auto w-full max-w-7xl p-5">
        <div className="bg-muted p-5 pt-10 rounded-xl">
          <h1 className="text-center text-primary text-base/relaxed md:text-xl/relaxed font-semibold">
            We help explorers <br /> find the best experiences around the world
          </h1>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8 mt-14">
            <div className="flex flex-col items-center justify-center text-center space-y-1">
              <div className="relative size-16 rounded-full bg-white overflow-hidden">
                <Image
                  src={
                    "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
                  }
                  alt="Curated Experiences"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-primary text-[15px]/relaxed font-semibold mt-4">
                Curated Experiences
              </h4>
              <p className="text-gray-500 text-xs/relaxed text-center">
                Handpicked events, movies, and activities that match your style
              </p>
            </div>

            <div className="flex flex-col items-center justify-center text-center space-y-1">
              <div className="relative size-16 rounded-full bg-white overflow-hidden">
                <Image
                  src={
                    "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
                  }
                  alt="Curated Experiences"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-primary text-[15px]/relaxed font-semibold mt-4">
                Instant Confirmation
              </h4>
              <p className="text-gray-500 text-xs/relaxed text-center">
                Get confirmed in seconds, no waiting or back-and-forth calls
              </p>
            </div>

            <div className="flex flex-col items-center justify-center text-center space-y-1">
              <div className="relative size-16 rounded-full bg-white overflow-hidden">
                <Image
                  src={
                    "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
                  }
                  alt="Curated Experiences"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-primary text-[15px]/relaxed font-semibold mt-4">
                Trusted Vendors
              </h4>
              <p className="text-gray-500 text-xs/relaxed text-center">
                Every vendor is verified so you can book with complete
                confidence
              </p>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-1">
              <div className="relative size-16 rounded-full bg-white overflow-hidden">
                <Image
                  src={
                    "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
                  }
                  alt="Curated Experiences"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-primary text-[15px]/relaxed font-semibold mt-4">
                All-in-One Platform
              </h4>
              <p className="text-gray-500 text-xs/relaxed text-center">
                Events, stays, activities—everything you need in one seamless
                place
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl hidden md:flex items-center justify-between mt-10">
            <h1 className="text-primary text-base/relaxed md:text-base/relaxed font-semibold">
              Where do you want to go?
            </h1>
            <Button className="text-sm font-medium">Discover</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Extras;