import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
// import { FaCircle } from "react-icons/fa";
import CinemaImage from "@/public/assets/sample-shortlet.jpg";

const ExploreMoviesCard = () => {
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
    <article className="relative bg-white rounded-lg p-6">
      <Button className="absolute bottom-3 right-3 text-white text-xs font-semibold shadow-none rounded-full h-fit !py-2">
        Buy Tickets
      </Button>
      <div className="relative size-24 bg-gray-200 rounded-lg -mt-20 overflow-hidden shadow-lg">
        <Image
          alt=""
          src={CinemaImage}
          className="w-full rounded-lg object-cover mb-5"
        />
      </div>
      <h2 className="text-primary text-sm font-semibold mt-8">
        Ebony Life Cinema
      </h2>
      <p className="text-gray-500 text-xs mt-1.5">
        Monday to Friday 09:00 - 24:00
      </p>
      <div className="flex items-center gap-1 text-primary text-xs font-semibold rounded mt-4">
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
      </div>
    </article>
  );
};

export default ExploreMoviesCard;
