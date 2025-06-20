// import React from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import bookingServices from "@/constants/services";

// const HeroSearchBox = () => {
//   return (
//     <section className="relative mx-auto w-full max-w-4xl px-5 md:p-10 -mt-10 md:-mt-20">
//       <div className="flex items-center gap-2 bg-white shadow-lg rounded-2xl p-4 md:p-6">
//         <div className="relative w-full">
//           <input
//             type="text"
//             className="w-full rounded-lg placeholder:text-primary placeholder:text-xs md:placeholder:text-sm placeholder:font-medium text-primary text-sm font-medium ring-0 outline-0 transition ease-in-out duration-200 ps-10 px-5 py-4"
//             placeholder="What are you looking for?"
//           />
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="2.5"
//             stroke="currentColor"
//             className="absolute left-4 top-1/2 -translate-y-1/2 size-[15px] text-primary"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
//             />
//           </svg>
//         </div>
//         <Select>
//           <SelectTrigger
//             defaultValue={"events"}
//             className="bg-none border-none !ring-0 !outline-none rounded-lg shadow-none !text-primary text-xs md:text-sm font-medium cursor-pointer p-0"
//           >
//             <SelectValue placeholder="Choose service" />
//           </SelectTrigger>
//           <SelectContent align="end">
//             {bookingServices?.map((service, index) => (
//               <SelectItem
//                 key={index}
//                 value={service?.key}
//                 className="text-gray-500 text-[13px] font-medium cursor-pointer"
//               >
//                 {service?.value}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//     </section>
//   );
// };

// export default HeroSearchBox;



















import React from "react";

const HeroSearchBox = () => {
  return (
    <section className="relative mx-auto w-full max-w-4xl px-5 md:p-10 -mt-9 md:-mt-20">
      <div className="bg-white shadow-lg rounded-2xl p-2 md:p-4">
        <div className="relative w-full">
          <input
            type="text"
            className="w-full rounded-lg placeholder:text-primary placeholder:text-xs md:placeholder:text-sm placeholder:font-medium text-primary text-sm font-medium ring-0 outline-0 transition ease-in-out duration-200 ps-10 px-5 py-4"
            placeholder="What are you looking for?"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.9"
            stroke="currentColor"
            className="absolute left-4 top-1/2 -translate-y-1/2 size-[14px] text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSearchBox;
