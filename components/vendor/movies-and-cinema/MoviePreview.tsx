import React, { useEffect, useRef } from "react";
import { Movie } from "@/types/vendor/movies-and-cinema";
import gsap from "gsap";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import { Button } from "@/components/ui/button";

interface ModalProps {
  movie: Movie | null;
  showModal: boolean;
  toggleModal: () => void;
}

const MoviePreview = ({ movie, showModal, toggleModal }: ModalProps) => {
  console.log(movie);

  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showModal) {
      gsap.to(overlayRef.current, { opacity: 0.5, duration: 0.3 });
      gsap.to(modalRef.current, { x: 0, duration: 0.3, ease: "power2.out" });
      modalRef.current?.focus();
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(modalRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power2.in",
        onComplete: toggleModal,
      });
    }
  }, [showModal, toggleModal]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-primary opacity-0 z-40"
        aria-hidden="true"
        onClick={toggleModal}
      />
      <div
        ref={modalRef}
        className="fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 transform translate-x-full overflow-y-auto"
        role="dialog"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <h4 className="text-primary text-sm font-semibold">Movie Details</h4>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="text-gray-500 size-[15px] -mt-1 cursor-pointer hover:text-primary"
            onClick={toggleModal}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
        <Separator />
        <div className="px-4 py-5">
          <h4 className="text-gray-700 text-[15px] font-semibold">
            {movie?.title}
          </h4>
        </div>
        <div className="px-4 space-y-3 mt-2">
          {/* <h4 className="text-xs font-medium">Showtimes</h4> */}
          <div className="flex items-center gap-6">
            <p className="text-gray-500 text-[12px]">Date created:</p>
            <p className="text-xs font-medium">
              {moment(movie?.createdAt).format("ll")}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-gray-500 text-[12px]">Movie code:</p>
            <p className="text-xs font-medium">{movie?.movieCode}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-gray-500 text-[12px]">Cinema:</p>
            <p className="text-xs font-medium">{movie?.cinema?.title}</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between px-4 py-4">
            <p className="text-primary text-[13px] font-medium">Showtimes</p>
            <Button className="bg-white text-primary text-[11px] border border-primary h-fit w-fit cursor-pointer hover:bg-sky-50/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.1"
                stroke="currentColor"
                className="text-primary size-[14px] -mt-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Showtime
            </Button>
          </div>
          <Separator />
          <div className="px-6 py-6">
            <ol className="relative border-s border-gray-200 dark:border-gray-700">
              {movie?.showtimes?.map((showtime) => (
                <li key={showtime?._id} className="mb-10 ms-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <svg
                      className="w-2.5 h-2.5 text-sky-700"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                  </span>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="flex items-center mb-1 text-[13px] font-medium dark:text-white">
                        Nollywood Auditorium
                      </h3>
                      <p className="block mb-2 text-[11px] font-normal leading-none text-gray-500 mt-2">
                        Thur Aug 4 at 09:45PM
                      </p>
                    </div>
                    <span className="text-[11px] text-red-600 font-medium bg-red-100/60 rounded-md px-3 py-1.5">
                      Upcoming
                    </span>
                  </div>

                  {/* <Button className="bg-white text-red-600 border border-red-500 text-[11px] h-fit w-fit px-1.5 py-1.5">
                    Cancel Showtime
                  </Button> */}
                </li>
              ))}
              {/* <li className="mb-10 ms-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <svg
                    className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </span>
              </li>
              <li className="ms-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <svg
                    className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </span>
              </li> */}
            </ol>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default MoviePreview;