"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMovie } from "@/services/public/movies-and-cinema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatMovieDuration, formatPrice } from "@/lib/utils";
import Image from "next/image";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Movie } from "@/types/vendor/movies-and-cinema";

gsap.registerPlugin(ScrollTrigger);

interface MoviePageProps {
  params: Promise<{ slug: string }>;
}

const staticReviews = [
  {
    name: "Abayomi Alli",
    rating: 5,
    text: "A thrilling masterpiece with stunning visuals!",
    date: "3 days ago",
  },
  {
    name: "Sarah Johnson",
    rating: 4,
    text: "Great story, but pacing was uneven.",
    date: "5 days ago",
  },
  {
    name: "Tunde Ade",
    rating: 5,
    text: "Absolutely loved it, a must-watch!",
    date: "1 week ago",
  },
];

const relatedMovies = [
  {
    title: "Inception",
    slug: "inception",
    image: "https://via.placeholder.com/150",
    genre: "Sci-Fi",
    duration: 148,
  },
  {
    title: "The Dark Knight",
    slug: "the-dark-knight",
    image: "https://via.placeholder.com/150",
    genre: "Action",
    duration: 152,
  },
  {
    title: "Interstellar",
    slug: "interstellar",
    image: "https://via.placeholder.com/150",
    genre: "Sci-Fi",
    duration: 169,
  },
];

const FormSchema = z.object({
  selectedShowtime: z.string().min(1, {
    message: "Please select a showtime.",
  }),
  selectedTickets: z
    .array(
      z.object({
        type: z.string().min(1, { message: "Ticket type is required." }),
        quantity: z
          .number()
          .min(1, { message: "Quantity must be at least 1." }),
      })
    )
    .min(1, { message: "Select at least one ticket type." }),
});

const Page = ({ params }: MoviePageProps) => {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  const router = useRouter();

  const { data, isLoading, error } = useGetMovie({ slug });

  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<
    { type: string; quantity: number }[]
  >([]);

  const heroRef = useRef<HTMLDivElement>(null);
  const showtimesRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);
  const ticketListRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedShowtime: "",
      selectedTickets: [],
    },
  });

  // Static animations (hero, showtimes, reviews, related)
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        if (heroRef.current) {
          gsap.fromTo(
            heroRef.current.querySelector(".hero-image"),
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
          );
          gsap.fromTo(
            heroRef.current.querySelectorAll(".hero-text"),
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "power2.out",
              delay: 0.2,
            }
          );
        }

        if (showtimesRef.current) {
          gsap.fromTo(
            showtimesRef.current.querySelectorAll(".showtime-button"),
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: showtimesRef.current,
                start: "top 80%",
              },
            }
          );
        }

        if (reviewsRef.current) {
          gsap.fromTo(
            reviewsRef.current.querySelectorAll(".review-card"),
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.2,
              ease: "power2.out",
              scrollTrigger: { trigger: reviewsRef.current, start: "top 80%" },
            }
          );
        }

        if (relatedRef.current) {
          gsap.fromTo(
            relatedRef.current.querySelectorAll(".related-card"),
            { opacity: 0, x: 20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.2,
              ease: "power2.out",
              scrollTrigger: { trigger: relatedRef.current, start: "top 80%" },
            }
          );
        }
      });

      return () => ctx.revert();
    },
    { dependencies: [data] }
  );

  // Ticket list animations
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        if (ticketListRef.current) {
          gsap.fromTo(
            ticketListRef.current.querySelectorAll(".ticket-item"),
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ticketListRef.current,
                start: "top 90%",
              },
            }
          );
        }
      });

      return () => ctx.revert();
    },
    { dependencies: [selectedTickets] }
  );

  if (isLoading)
    return <div className="text-center py-20 text-[13px]">Loading...</div>;
  if (error || !data?.data)
    return (
      <div className="text-center py-20 text-red-500 text-[13px]">
        Error: {error?.message || data?.message}
      </div>
    );

  const movie = data?.data;

  const selectedShowtime = form.watch("selectedShowtime");
  const selectedShowtimeData = movie.showtimes.find(
    (st) => st._id === selectedShowtime
  );

  const calculateTicketPrice = (
    ticket: Movie["showtimes"][0]["tickets"][0]
  ) => {
    if (!ticket.basePrice) return 0;
    if (!ticket.hasDiscount || !ticket.discountType || !ticket.discountValue) {
      return ticket.basePrice;
    }
    if (ticket.discountType === "percentage") {
      return ticket.basePrice * (1 - ticket.discountValue / 100);
    }
    return ticket.basePrice - ticket.discountValue;
  };

  const totalPrice = selectedTickets.reduce((sum, ticket) => {
    const ticketData = selectedShowtimeData?.tickets.find(
      (t) => t._id === ticket.type
    );
    return (
      sum +
      ticket.quantity * (ticketData ? calculateTicketPrice(ticketData) : 0)
    );
  }, 0);

  function formatDateTime(
    dateStr: string,
    timeStr: string,
    // auditorium: string
  ) {
    const date = moment(dateStr);
    const [hours, minutes] = timeStr.split(":");
    date.set({ hour: +hours, minute: +minutes });
    // const status = date.isBefore(now)
    //   ? "Past"
    //   : date.isSame(now, "hour")
    //   ? "Now Showing"
    //   : "Upcoming";
    return `${date.format("ddd MMM D h:mmA")}`;
  }

  const handleAddTicket = (ticketId: string) => {
    if (!selectedTickets.find((t) => t.type === ticketId)) {
      const ticket = selectedShowtimeData?.tickets.find(
        (t) => t._id === ticketId
      );
      const updatedTickets = [
        ...selectedTickets,
        { type: ticketId, quantity: 1 },
      ];
      setSelectedTickets(updatedTickets);
      form.setValue("selectedTickets", updatedTickets);
      toast.success(`${ticket?.name} ticket added`);
    }
  };

  const handleRemoveTicket = (ticketId: string) => {
    const ticket = selectedShowtimeData?.tickets.find(
      (t) => t._id === ticketId
    );
    const updatedTickets = selectedTickets.filter((t) => t.type !== ticketId);
    setSelectedTickets(updatedTickets);
    form.setValue("selectedTickets", updatedTickets);
    toast.info(`${ticket?.name} ticket removed`);
  };

  const handleQuantityChange = (ticketId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveTicket(ticketId);
    } else {
      const updatedTickets = selectedTickets.map((t) =>
        t.type === ticketId ? { ...t, quantity } : t
      );
      setSelectedTickets(updatedTickets);
      form.setValue("selectedTickets", updatedTickets);
    }
  };

  const onSubmit = () => {
    const { selectedShowtime, selectedTickets } = form.getValues();
    const query = new URLSearchParams({
      showtime: selectedShowtime,
      tickets: JSON.stringify(selectedTickets),
    }).toString();
    router.push(`/movies/${movie.slug}/checkout?${query}`);
    toast.success("Proceeding to checkout");
  };

  return (
    <section className="bg-muted/60 min-h-[100vh]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 py-8 md:py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="hero-text">
            <h1 className="text-primary text-xl font-semibold">
              {movie.title}
            </h1>
            {/* <p className="text-gray-500 text-xs mt-1">{movie.cinema.title}</p> */}
          </div>
          <div className="flex items-center gap-2 hero-text">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white text-primary text-xs border-none border-primary shadow-none cursor-pointer"
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="size-[15px] mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg> */}
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs cursor-pointer">
                  Twitter
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs cursor-pointer">
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs cursor-pointer">
                  WhatsApp
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className="!bg-white text-primary text-xs border-none border-primary shadow-none cursor-pointer"
              >
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                stroke="currentColor"
                className="size-[15px] mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg> */}
              Add to favourites
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div
              ref={heroRef}
              className="bg-white h-[40vh] md:h-[450px] rounded-xl relative overflow-hidden"
            >
              <Image
                src={movie.images?.[0] || "/placeholder.jpg"}
                alt={movie.title}
                className="hero-image object-cover"
                fill
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>

            <Card className="bg-white shadow-none border-0">
              <CardContent className="px-6 py-4 space-y-6">
                <div className="max-w-full md:max-w-[30%] space-y-6">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-primary text-[13px] font-semibold">
                      Duration
                    </p>
                    <p className="text-gray-700 text-xs font-medium">
                      {formatMovieDuration(movie.duration)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-primary text-[13px] font-semibold">
                      Genres
                    </p>
                    <div className="flex items-center gap-2">
                      {movie.genre.map((genre, index) => (
                        <span
                          key={index}
                          className="bg-muted/75 text-sky-700 text-[11px] font-medium rounded px-2 py-1 transition-transform hover:scale-105"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-primary text-[13px] font-semibold">
                      Language
                    </p>
                    <p className="text-gray-700 text-xs font-medium">
                      {movie.language || "English"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-primary text-[13px] font-semibold">
                      Rating
                    </p>
                    <p className="text-gray-700 text-xs font-medium">
                      {movie.rating}
                    </p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <h4 className="text-primary text-[13px] font-semibold">
                    Synopsis
                  </h4>
                  <p className="text-gray-500 text-xs/relaxed">
                    {isSynopsisExpanded
                      ? movie.description
                      : movie.description.slice(0, 200) +
                        (movie.description.length > 200 ? "..." : "")}
                    {movie.description.length > 200 && (
                      <Button
                        variant="link"
                        className="text-primary text-[10px] h-fit w-fit !px-0 cursor-pointer ml-2"
                        onClick={() =>
                          setIsSynopsisExpanded(!isSynopsisExpanded)
                        }
                      >
                        {isSynopsisExpanded ? "Read Less" : "Read More"}
                      </Button>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-none border-0" ref={reviewsRef}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary text-sm font-semibold">
                    Movie Reviews
                  </CardTitle>
                  <Button
                    className="bg-primary text-[11px] h-fit w-fit cursor-pointer !px-3 !py-2"
                    onClick={() => alert("Review submission not implemented")}
                  >
                    <PencilSimpleLineIcon className="size-[14px] mr-1" />
                    Write review
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 review-card">
                  <div className="col-span-1 flex flex-col items-center justify-center">
                    <p className="text-primary text-4xl font-semibold">4.8</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-500 text-[11px] mt-1">
                      120 reviews
                    </p>
                  </div>
                  <div className="col-span-1 md:col-span-4 space-y-2">
                    <div className="flex items-center gap-4">
                      <Progress value={60} className="!h-2" />
                      <p className="text-gray-700 text-xs font-medium">5.0</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={30} className="!h-2" />
                      <p className="text-gray-700 text-xs font-medium">4.0</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={8} className="!h-2" />
                      <p className="text-gray-700 text-xs font-medium">3.0</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={2} className="!h-2" />
                      <p className="text-gray-700 text-xs font-medium">2.0</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={0} className="!h-2" />
                      <p className="text-gray-700 text-xs font-medium">1.0</p>
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex flex-col space-y-6 review-card">
                  {staticReviews.map((review, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-sky-600 text-white text-[11px] font-medium size-6 rounded-full flex items-center justify-center">
                            {review.name[0]}
                          </div>
                          <p className="text-gray-700 text-xs font-semibold">
                            {review.name}
                          </p>
                          <p className="text-gray-500 text-[11px]">
                            {review.date}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="size-4 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs/relaxed mt-3">
                        {review.text}
                      </p>
                      {index < staticReviews.length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 space-y-4">
            <Card
              className="!bg-white shadow-xs border-none sticky top-4 z-10"
              ref={showtimesRef}
            >
              <CardHeader>
                <h1 className="text-primary text-sm font-semibold">
                  Select a Showtime
                </h1>
              </CardHeader>
              <CardContent className="-mt-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="selectedShowtime"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-gray-700 text-xs">
                            Select showtime
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full text-xs !py-5 cursor-pointer showtime-button">
                                <SelectValue placeholder="Select showtime" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {movie.showtimes
                                .filter((st) => {
                                  const date = moment(st.date);
                                  const [hours, minutes] =
                                    st.startTime.split(":");
                                  date.set({ hour: +hours, minute: +minutes });
                                  return !date.isBefore(moment());
                                })
                                .map((showtime) => (
                                  <SelectItem
                                    key={showtime._id}
                                    value={showtime._id}
                                    className="w-full !py-3 cursor-pointer text-xs"
                                  >
                                    {formatDateTime(
                                      showtime.date,
                                      showtime.startTime,
                                      // showtime.auditorium
                                    )}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedShowtime && (
                      <FormField
                        control={form.control}
                        name="selectedTickets"
                        render={() => (
                          <FormItem className="w-full">
                            <FormLabel className="text-gray-700 text-xs">
                              Select ticket
                            </FormLabel>
                            <Select onValueChange={handleAddTicket} value="">
                              <FormControl>
                                <SelectTrigger className="w-full text-xs !py-5 cursor-pointer">
                                  <SelectValue placeholder="Select a ticket type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedShowtimeData?.tickets.map(
                                  (ticket) => (
                                    <SelectItem
                                      key={ticket._id}
                                      value={ticket._id}
                                      className="w-full !py-3 cursor-pointer"
                                      disabled={selectedTickets.some(
                                        (t) => t.type === ticket._id
                                      )}
                                    >
                                      <div className="flex items-center justify-between gap-4">
                                        <p className="text-xs text-gray-500">
                                          {ticket.name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                          {ticket.hasDiscount &&
                                            ticket.discountValue && (
                                              <p className="text-xs text-gray-400 line-through">
                                                NGN{" "}
                                                {formatPrice(
                                                  Number(ticket.basePrice)
                                                )}
                                              </p>
                                            )}
                                          <p className="text-xs text-gray-700 font-medium">
                                            NGN{" "}
                                            {formatPrice(
                                              calculateTicketPrice(ticket)
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {selectedTickets.length > 0 && (
                      <div className="space-y-2" ref={ticketListRef}>
                        <p className="text-gray-700 text-xs font-semibold">
                          Selected Tickets
                        </p>
                        {selectedTickets.map((ticket) => {
                          const ticketData = selectedShowtimeData?.tickets.find(
                            (t) => t._id === ticket.type
                          );
                          return (
                            <div
                              key={ticket.type}
                              className="ticket-item flex items-center gap-2 border rounded-md p-2 hover:bg-muted transition-colors"
                            >
                              <p className="text-xs text-gray-700 flex-1">
                                {ticketData?.name}
                              </p>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-6 w-6 p-0 text-xs"
                                  onClick={() =>
                                    handleQuantityChange(
                                      ticket.type,
                                      ticket.quantity - 1
                                    )
                                  }
                                >
                                  -
                                </Button>
                                <Input
                                  type="number"
                                  min={1}
                                  value={ticket.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      ticket.type,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-12 text-xs text-center"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-6 w-6 p-0 text-xs"
                                  onClick={() =>
                                    handleQuantityChange(
                                      ticket.type,
                                      ticket.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-xs text-red-500"
                                  onClick={() =>
                                    handleRemoveTicket(ticket.type)
                                  }
                                >
                                  ✕
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <p className="text-gray-700 text-xs font-semibold">
                        Total
                      </p>
                      <p className="text-primary text-[13px] font-semibold">
                        NGN {formatPrice(totalPrice)}
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="bg-primary text-xs w-full cursor-pointer !py-5 disabled:bg-primary/90"
                      disabled={
                        !form.getValues("selectedShowtime") ||
                        selectedTickets.length === 0
                      }
                    >
                      Proceed to checkout
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xs border-none" ref={relatedRef}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h4 className="text-primary text-sm font-semibold">
                    You may also like
                  </h4>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="hover:bg-muted rounded-md cursor-pointer !outline-0 !ring-0 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.8"
                        stroke="currentColor"
                        className="text-primary size-[20px]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                      </svg>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-gray-600 text-xs cursor-pointer"
                        onClick={() => router.push("/movies")}
                      >
                        See more
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 -mt-2">
                {relatedMovies.map((related, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 related-card"
                  >
                    <div className="relative size-16 md:size-20 bg-muted rounded-md">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1 py-1">
                      <p
                        className="text-primary text-[13px] font-medium cursor-pointer hover:underline"
                        onClick={() => router.push(`/movies/${related.slug}`)}
                      >
                        {related.title}
                      </p>
                      <div className="flex items-center gap-1 text-gray-700 text-[10px]">
                        <span>{related.genre}</span>
                        <span>|</span>
                        <span>{formatMovieDuration(related.duration)}</span>
                      </div>
                      <p className="text-sky-600 text-[11px]">
                        Next Showing: {moment().add(1, "days").format("MMM D")}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;