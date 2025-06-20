import React from "react";
import { FaCircle } from "react-icons/fa";

const ExploreMoviesCard = () => {
  return (
    <article className="flex bg-white transition hover:shadow-xl rounded-lg overflow-hidden">
      {/*  */}

      <div className="hidden sm:block sm:basis-56">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
          className="aspect-square h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary text-[11px] font-medium">2025</span>
            <FaCircle size={3} color="#183264" />
            <span className="text-primary text-[11px] font-medium">Drama</span>
            <FaCircle size={3} color="#183264" />
            <span className="text-primary text-[11px] font-medium">
              2h 30min
            </span>
          </div>
          <a href="#">
            <h3 className="text-primary text-sm font-medium">The Last Rodeo</h3>
          </a>

          <p className="mt-2 line-clamp-2 text-xs/relaxed text-gray-500 font-normal">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae
            dolores, possimus pariatur animi temporibus nesciunt praesentium
            dolore sed nulla ipsum eveniet corporis quidem, mollitia itaque
            minus soluta, voluptates neque explicabo tempora nisi culpa eius
            atque dignissimos. Molestias explicabo corporis voluptatem?
          </p>

          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="size-4 rounded-full bg-primary text-white text-[11px] font-medium flex items-center justify-center">
                G
              </div>
              <p className="text-primary text-xs font-normal">
                Genesis Cinemas Lekki
              </p>
            </div>
            <div className="inline-flex text-primary text-xs font-normal border border-dashed border-primary/80 rounded-md px-2.5 py-2 mt-3">
              Sept 4 at 09:45
            </div>
          </div>

          {/* <Button className="bg-inherit hover:bg-inherit text-primary text-xs shadow-none p-0">Read more</Button> */}
        </div>

        <div className="sm:flex sm:items-end sm:justify-end">
          {/* <div className="space-y-1.5">
            <p className="text-primary text-xs font-medium">Genesis Cinemas Lekki</p>
            <p className="text-primary text-xs font-medium"> Tomorrow 09:45</p>
            </div> */}
          <a
            href="#"
            className="block bg-primary px-5 py-3 text-center text-xs font-bold text-white uppercase transition"
          >
            BUY TICKETS
          </a>
        </div>
      </div>
    </article>
  );
};

export default ExploreMoviesCard;