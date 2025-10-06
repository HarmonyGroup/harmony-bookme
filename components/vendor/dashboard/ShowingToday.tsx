"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { useGetMoviesShowingToday } from "@/services/vendor/movies-and-cinema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyIcon from "@/public/assets/empty-data-icon.png";
import MoviePreview from "../movies-and-cinema/MoviePreview";
import { Movie } from "@/types/vendor/movies-and-cinema";
import AddShowtimeModal from "../movies-and-cinema/AddShowtimeModal";

const dummyMovie = {
  _id: "movie_123",
  title: "The Galactic Odyssey",
  slug: "the-galactic-odyssey",
  images: ["https://via.placeholder.com/300x450"],
  cinema: { title: "Starlight Cinema", location: "123 Main St, Lagos" },
  genre: "Sci-Fi, Action",
  runtime: "2h 15m",
  rating: "PG-13",
  description:
    "An epic space adventure following a rogue pilot and a rebel crew on a mission to save the galaxy.",
  releaseDate: "2025-07-01",
  director: "Jane Doe",
  cast: ["John Smith", "Emma Watson", "Michael Chen"],
  showtimes: [
    {
      _id: "show_1",
      startTime: "2025-07-29T14:00:00Z",
      tickets: [{ ticketTypeId: "t1", soldCount: 50, price: 1000 }],
      totalSales: 50000,
    },
    {
      _id: "show_2",
      startTime: "2025-07-29T17:00:00Z",
      tickets: [{ ticketTypeId: "t1", soldCount: 30, price: 1000 }],
      totalSales: 30000,
    },
    {
      _id: "show_3",
      startTime: "2025-07-29T20:00:00Z",
      tickets: [{ ticketTypeId: "t1", soldCount: 40, price: 1000 }],
      totalSales: 40000,
    },
  ],
};

// const useCancelShowtime = () => {
//   const [isPending, setIsPending] = useState<string | null>(null);

//   const cancelShowtime = async (showtimeId: string) => {
//     setIsPending(showtimeId);
//     const toastId = toast.loading("Cancelling showtime...");
//     try {
//       const response = await fetch(`/api/showtimes/${showtimeId}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || "Failed to cancel showtime");
//       }
//       toast.success("Showtime cancelled successfully", { id: toastId });
//     } catch (error: any) {
//       toast.error(error.message || "Failed to cancel showtime", {
//         id: toastId,
//       });
//     } finally {
//       setIsPending(null);
//     }
//   };

//   return { cancelShowtime, isPending };
// };

// const MoviePreviewModal = ({
//   movie,
//   isOpen,
//   onClose,
// }: {
//   movie: typeof dummyMovie | null;
//   isOpen: boolean;
//   onClose: () => void;
// }) => {
//   const modalRef = useRef<HTMLDivElement>(null);
//   const overlayRef = useRef<HTMLDivElement>(null);
//   const { cancelShowtime, isPending } = useCancelShowtime();

//   useEffect(() => {
//     if (isOpen) {
//       gsap.to(overlayRef.current, { opacity: 0.5, duration: 0.3 });
//       gsap.to(modalRef.current, { x: 0, duration: 0.3, ease: "power2.out" });
//       modalRef.current?.focus();
//     } else {
//       gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
//       gsap.to(modalRef.current, {
//         x: "100%",
//         duration: 0.3,
//         ease: "power2.in",
//         onComplete: onClose,
//       });
//     }
//   }, [isOpen, onClose]);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [onClose]);

//   if (!isOpen || !movie) return null;

//   const totalTickets = movie.showtimes.reduce(
//     (sum, showtime) =>
//       sum + showtime.tickets.reduce((s, t) => s + t.soldCount, 0),
//     0
//   );

//   const totalRevenue = movie.showtimes.reduce(
//     (sum, showtime) => sum + showtime.totalSales,
//     0
//   );

//   return (
//     <>
//       <div
//         ref={overlayRef}
//         className="fixed inset-0 bg-primary opacity-0 z-40"
//         onClick={onClose}
//         aria-hidden="true"
//       />
//       <div
//         ref={modalRef}
//         className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50 transform translate-x-full overflow-y-auto"
//         role="dialog"
//         aria-labelledby="modal-title"
//         tabIndex={-1}
//       >
//         <div className="p-0">
//           {/* <div className="flex justify-between items-center mb-4">
//             <h2
//               id="modal-title"
//               className="text-lg font-semibold text-gray-900"
//             >
//               {movie.title}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//               aria-label="Close modal"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="size-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div> */}
//           <div className="space-y-6">
//             {/* Movie Poster */}
//             <div className="relative w-full h-[300px] overflow-hidden">
//               <Image
//                 src={movie.images[0]}
//                 alt={movie.title}
//                 className="object-cover"
//                 fill
//               />
//             </div>
//             {/* Basic Details */}
//             <div className="space-y-2">
//               <h3 className="text-sm font-medium text-gray-700">Details</h3>
//               <p className="text-xs text-gray-600">
//                 <strong>Genre:</strong> {movie.genre}
//               </p>
//               <p className="text-xs text-gray-600">
//                 <strong>Runtime:</strong> {movie.runtime}
//               </p>
//               <p className="text-xs text-gray-600">
//                 <strong>Rating:</strong> {movie.rating}
//               </p>
//               <p className="text-xs text-gray-600">
//                 <strong>Release Date:</strong>{" "}
//                 {new Date(movie.releaseDate).toLocaleDateString()}
//               </p>
//               <p className="text-xs text-gray-600">
//                 <strong>Director:</strong> {movie.director}
//               </p>
//               <p className="text-xs text-gray-600">
//                 <strong>Cast:</strong> {movie.cast.join(", ")}
//               </p>
//               <p className="text-xs text-gray-600">
//                 <strong>Description:</strong> {movie.description}
//               </p>
//             </div>
//             {/* Cinema Details */}
//             <div className="space-y-2">
//               <h3 className="text-sm font-medium text-gray-700">Cinema</h3>
//               <p className="text-xs text-gray-600">
//                 <strong>Name:</strong> {movie.cinema.title}
//               </p>
//               <p className="text-xs text-gray-600">
//                 <strong>Location:</strong> {movie.cinema.location}
//               </p>
//             </div>
//             {/* Analytics */}
//             <div className="space-y-2">
//               <h3 className="text-sm font-medium text-gray-700">Analytics</h3>
//               <p className="text-xs text-gray-600">
//                 <strong>Total Tickets Sold:</strong> {totalTickets}
//               </p>
//               <p className="text-xs text-gray-600">
//                 <strong>Total Revenue:</strong> NGN {formatPrice(totalRevenue)}
//               </p>
//             </div>
//             {/* Showtimes Timeline */}
//             <div className="space-y-4">
//               <h3 className="text-sm font-medium text-gray-700">Showtimes</h3>
//               <div className="space-y-4">
//                 {movie.showtimes.map((showtime) => (
//                   <div
//                     key={showtime._id}
//                     className="flex items-center gap-4 border-l-4 border-primary pl-4 py-2"
//                   >
//                     <div className="flex-1">
//                       <p className="text-xs font-medium text-gray-700">
//                         {new Date(showtime.startTime).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </p>
//                       <p className="text-xs text-gray-600">
//                         Tickets Sold:{" "}
//                         {showtime.tickets.reduce(
//                           (sum, t) => sum + t.soldCount,
//                           0
//                         )}
//                       </p>
//                       <p className="text-xs text-gray-600">
//                         Total Sales: NGN {formatPrice(showtime.totalSales)}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => cancelShowtime(showtime._id)}
//                       disabled={isPending === showtime._id}
//                       className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center gap-1"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                         className="size-4"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M6 18L18 6M6 6l12 12"
//                         />
//                       </svg>
//                       Cancel
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

const ShowingToday = () => {
  // const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cinema, setCinema] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMovieCinema] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showtimeModal, setShowtimeModal] = useState(false);

  const { data, isLoading } = useGetMoviesShowingToday({
    page,
    limit,
    search: debouncedSearch,
    cinema: cinema,
  });

  console.log(data);

  return (
    <>
      <div className="bg-white border border-muted rounded-lg shadow-none p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-primary text-[13px] font-semibold">
            Showing Today
          </h1>
          <div className="relative hidden md:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              stroke="currentColor"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[13px] text-gray-500 mt-[0.5px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <Input
              type="search"
              className="w-[300px] bg-muted/60 !text-xs placeholder:text-gray-400 placeholder:text-xs placeholder:font-medium shadow-none outline-none ring-0 focus:shadow-none px-4 !py-5 ps-9 border !border-muted focus-visible:ring-0 focus-visible:border-primary transition-all ease-in-out duration-200"
              placeholder="Search booking code here"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          {isLoading ? (
            <Table className="mt-4 !px-10">
              <TableHeader className="!px-10">
                <TableRow className="bg-muted/60 border-muted text-xs !px-10">
                  <TableHead className="text-gray-800 font-medium py-5 pl-4">
                    Movie Name
                  </TableHead>
                  <TableHead className="text-gray-800 font-medium py-4">
                    Cinema
                  </TableHead>
                  <TableHead className="text-gray-800 font-medium py-4">
                    Total Bookings
                  </TableHead>
                  <TableHead className="text-gray-800 font-medium py-4">
                    Revenue
                  </TableHead>
                  <TableHead className="text-gray-800 font-medium py-4 text-right pr-4">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, index) => (
                  <TableRow key={index} className="border-muted">
                    <TableCell className="py-7 pl-4 align-middle">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-10 w-10 bg-gray-200 rounded-md" />
                        <Skeleton className="h-4 w-[200px] bg-gray-200 rounded-sm" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4 align-middle">
                      <Skeleton className="h-4 w-[100px] bg-gray-200 rounded-sm" />
                    </TableCell>
                    <TableCell className="py-4 align-middle">
                      <Skeleton className="h-4 w-[80px] bg-gray-200 rounded-sm" />
                    </TableCell>
                    <TableCell className="py-4 align-middle">
                      <Skeleton className="h-4 w-[80px] bg-gray-200 rounded-sm" />
                    </TableCell>
                    <TableCell className="py-4 align-middle text-right pr-4">
                      <Skeleton className="h-4 w-4 ml-auto bg-gray-200 rounded-sm" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : data?.data?.length ? (
            <Table className="mt-4 !px-10">
              <TableHeader className="!px-10">
                <TableRow className="bg-muted/60 border-muted text-xs !px-10">
                  <TableHead className="text-gray-800 font-medium py-6 pl-4">
                    Movie Name
                  </TableHead>
                  <TableHead className="text-gray-800 font-medium">
                    Cinema
                  </TableHead>
                  <TableHead className="text-gray-800 font-medium">
                    Bookings
                  </TableHead>
                  {/* <TableHead className="text-gray-700 font-medium py-4">
                    Revenue
                  </TableHead> */}
                  <TableHead className="text-gray-800 font-medium text-right pr-4">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data?.data?.map((movie) => (
                  <TableRow key={movie?._id} className="border-muted">
                    <TableCell className="py-7 pl-4 align-middle">
                      {/* <Link
                        href={`/vendor/movies/${movie?.slug}`}
                        className="flex items-center gap-2.5"
                      >
                        <div className="relative size-10 bg-gray-100 rounded-md overflow-hidden">
                          <Image
                            src={movie?.images?.[0] || "/placeholder-image.png"}
                            alt={movie?.title}
                            className="object-cover"
                            fill
                          />
                        </div>
                        <span className="text-gray-700 text-xs font-semibold">
                          {movie?.title}
                        </span>
                      </Link> */}
                      <div className="flex items-center gap-2">
                        <div className="relative size-6 bg-gray-100 rounded-full overflow-hidden">
                          <Image
                            src={movie?.images?.[0]}
                            alt={movie?.title}
                            className="object-cover"
                            fill
                          />
                        </div>
                        <span className="text-gray-800 text-xs font-semibold">
                          {movie?.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 align-middle text-gray-600 text-xs font-medium">
                      {movie?.cinema?.title}
                    </TableCell>
                    <TableCell className="py-4 align-middle text-gray-600 text-xs font-medium">
                      {movie.showtimes?.reduce(
                        (
                          sum: number,
                          showtime: { tickets: { soldCount: number }[] }
                        ) =>
                          sum +
                          showtime.tickets.reduce(
                            (s: number, t: { soldCount: number }) =>
                              s + t.soldCount,
                            0
                          ),
                        0
                      )}
                    </TableCell>
                    {/* <TableCell className="py-4 align-middle text-gray-700 text-xs">
                      NGN{" "}
                      {formatPrice(
                        movie.showtimes?.reduce(
                          (sum: number, showtime: any) =>
                            sum + showtime.totalSales,
                          0
                        )
                      )}
                    </TableCell> */}
                    <TableCell className="py-4 align-middle text-right pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer hover:bg-muted rounded-md transition-colors ease-in-out duration-300 p-1 focus-visible:outline-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.8"
                            stroke="currentColor"
                            className="size-[20px] text-gray-700"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                            />
                          </svg>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMovie({ ...dummyMovie, ...movie }); // Merge dummy data with real movie data
                              setIsModalOpen(true);
                            }}
                            className="text-gray-700 text-xs font-medium cursor-pointer hover:bg-muted"
                          >
                            Preview
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                            onClick={() => {
                              setSelectedMovieCinema(movie?.cinema?._id);
                              setShowtimeModal(true);
                            }}
                            className="text-gray-700 text-xs font-medium cursor-pointer flex items-center gap-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="text-gray-700 size-[14px]"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                              />
                            </svg>
                            Add showtime
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-20 min-h-[400px]">
              <Image
                src={EmptyIcon}
                className="size-14"
                alt="Harmony Bookme"
                loading="lazy"
              />
              <h1 className="text-gray-700 text-sm font-semibold">No movies</h1>
              <p className="text-gray-500 text-xs text-center max-w-md">
                Movies showing today will show up here.
              </p>
            </div>
          )}
        </div>
        {/* <MoviePreviewModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        /> */}
      </div>
      {isModalOpen && (
        <MoviePreview
          showModal={isModalOpen}
          toggleModal={() => setIsModalOpen(!isModalOpen)}
          movie={selectedMovie}
        />
      )}
      <AddShowtimeModal
        cinema={String(selectedMovieCinema)}
        showModal={showtimeModal}
        toggleModal={() => setShowtimeModal(!showtimeModal)}
      />
    </>
  );
};

export default ShowingToday;