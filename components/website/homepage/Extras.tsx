// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import React from "react";

// const Extras = () => {
//   return (
//     <section>
//       <div className="mx-auto w-full max-w-7xl p-5">
//         <div className="bg-muted p-5 pt-10 rounded-xl">
//           <h1 className="text-center text-primary text-base/relaxed md:text-xl/relaxed font-semibold">
//             We help explorers <br /> find the best experiences around the world
//           </h1>

//           <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8 mt-14">
//             <div className="flex flex-col items-center justify-center text-center space-y-1">
//               <div className="relative size-16 rounded-full bg-white overflow-hidden">
//                 <Image
//                   src={
//                     "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
//                   }
//                   alt="Curated Experiences"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <h4 className="text-primary text-[15px]/relaxed font-semibold mt-4">
//                 Curated Experiences
//               </h4>
//               <p className="text-gray-500 text-xs/relaxed text-center">
//                 Handpicked events, movies, and activities that match your style
//               </p>
//             </div>

//             <div className="flex flex-col items-center justify-center text-center space-y-1">
//               <div className="relative size-16 rounded-full bg-white overflow-hidden">
//                 <Image
//                   src={
//                     "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
//                   }
//                   alt="Curated Experiences"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <h4 className="text-primary text-[15px]/relaxed font-semibold mt-4">
//                 Instant Confirmation
//               </h4>
//               <p className="text-gray-500 text-xs/relaxed text-center">
//                 Get confirmed in seconds, no waiting or back-and-forth calls
//               </p>
//             </div>

//             <div className="flex flex-col items-center justify-center text-center space-y-1">
//               <div className="relative size-16 rounded-full bg-white overflow-hidden">
//                 <Image
//                   src={
//                     "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
//                   }
//                   alt="Curated Experiences"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <h4 className="text-primary text-[15px]/relaxed font-semibold mt-4">
//                 Trusted Vendors
//               </h4>
//               <p className="text-gray-500 text-xs/relaxed text-center">
//                 Every vendor is verified so you can book with complete
//                 confidence
//               </p>
//             </div>
//             <div className="flex flex-col items-center justify-center text-center space-y-1">
//               <div className="relative size-16 rounded-full bg-white overflow-hidden">
//                 <Image
//                   src={
//                     "https://img.freepik.com/free-photo/tourist-carrying-luggage_23-2151747475.jpg?uid=R137948985&ga=GA1.1.1977978369.1744267390&semt=ais_hybrid&w=740"
//                   }
//                   alt="Curated Experiences"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <h4 className="text-primary text-[15px]/relaxed font-semibold mt-4">
//                 All-in-One Platform
//               </h4>
//               <p className="text-gray-500 text-xs/relaxed text-center">
//                 Events, stays, activities—everything you need in one seamless
//                 place
//               </p>
//             </div>
//           </div>

//           <div className="bg-white p-5 rounded-xl hidden md:flex items-center justify-between mt-10">
//             <h1 className="text-primary text-base/relaxed md:text-base/relaxed font-semibold">
//               Where do you want to go?
//             </h1>
//             <Button className="text-sm font-medium">Discover</Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Extras;

import React from "react";

const Extras = () => {
  return (
    <section className="pt-14 md:pt-8 pb-6 md:pb-10">
      <div className="bg-muted/50 mx-auto w-full max-w-7xl p-6 pt-16 rounded-3xl">
        {/* Title */}
        {/* <p className="text-center text-sm font-bold uppercase text-primary">3 easy steps</p> */}
        <h2 className="text-center text-2xl font-bold text-primary">
          Features
        </h2>
        <p className="mx-auto mb-8 mt-4 max-w-lg text-center text-sm/relaxed text-gray-600 md:mb-12 lg:mb-14">
          From creating your account to securing your booking, we&apos;ve made the process quick and effortless.
        </p>
        {/* Content */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
          {/* Item */}
          <div className="bg-white rounded-xl border border-solid border-muted p-6">
            <div className="inline-flex items-center justify-center rounded-md bg-muted text-primary size-10">
              <p className="text-primarytext-sm font-bold">1</p>
            </div>
            <p className="text-primary text-base font-semibold mt-6">
              Create your account
            </p>
            <p className="text-[13px]/relaxed text-gray-600 mt-2">
              Sign up as an explorer in seconds. Just provide your basic details
              and you&apos;re ready to start discovering amazing experiences.
            </p>
          </div>
          {/* Item */}
          <div className="bg-white rounded-xl border border-solid border-muted p-6">
            <div className="inline-flex items-center justify-center rounded-md bg-muted text-primary size-10">
              <p className="text-primarytext-sm font-bold">2</p>
            </div>
            <p className="text-primary text-base font-semibold mt-6">
              Browse listings
            </p>
            <p className="text-[13px]/relaxed text-gray-600 mt-2">
              Explore thousands of events, movies, leisure, and accommodations.
              Filter by date, price, or category for the best matches.
            </p>
          </div>
          {/* Item */}
          <div className="bg-white rounded-xl border border-solid border-muted p-6">
            <div className="inline-flex items-center justify-center rounded-md bg-muted text-primary size-10">
              <p className="text-primarytext-sm font-bold">3</p>
            </div>
            <p className="text-primary text-base font-semibold mt-6">
              Make bookings
            </p>
            <p className="text-[13px]/relaxed text-gray-600 mt-2">
              Complete your booking with our secure payment system powered by
              Paystack. Pay with your card, bank transfer, or mobile money.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Extras;
