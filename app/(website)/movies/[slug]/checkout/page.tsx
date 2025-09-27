"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateBooking } from "@/services/explorer/booking";
import { CreateBookingRequest } from "@/types/booking";
import { toast } from "sonner";
import { useGetMovie } from "@/services/public/movies-and-cinema";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import moment from "moment";
import { Loader2 } from "lucide-react";
import BookingConfirmation from "@/components/website/events/BookingConfirmation";
import { Movie } from "@/types/vendor/movies-and-cinema";
import PaystackPop from "@paystack/inline-js";
import { useVerifyPayment } from "@/services/explorer/payment";

gsap.registerPlugin(ScrollTrigger);

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const FormSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name is too long."),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters.")
    .max(50, "Last name is too long."),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .min(1, "Email is required."),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?\d{10,15}$/.test(val),
      "Please enter a valid phone number."
    ),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions."),
  couponCode: z.string().optional(),
});

const Page = ({ params, searchParams }: PageProps) => {
  const resolvedParams = React.use(params);
  const resolvedSearchParams = React.use(searchParams);
  const { slug } = resolvedParams;
  const { showtime, tickets: ticketsParam } = resolvedSearchParams;
  const { data: session, status } = useSession();
  const { data, isLoading } = useGetMovie({ slug });
  const { mutate: createBooking, isPending } = useCreateBooking();
  const { mutate: verifyPayment } =
    useVerifyPayment();

  const [couponCode, setCouponCode] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const movie = data?.data as Movie | undefined;

  const formRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Set up Paystack event listeners
  useEffect(() => {
    const handleSuccess = (event: Event) => {
      const customEvent = event as CustomEvent<{ reference: string }>;
      console.log("Payment successful:", customEvent.detail);
      // Verify payment
      verifyPayment(customEvent.detail.reference, {
        onSuccess: (verifyResponse) => {
          if (
            verifyResponse.success &&
            verifyResponse.data.status === "success"
          ) {
            toast.success(
              "Payment successful! Your booking has been confirmed."
            );
            setSuccessModal(true);
          } else {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        onError: (error) => {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed. Please contact support.");
        },
      });
    };

    const handleCancel = () => {
      console.log("Payment cancelled");
      toast.info("Payment cancelled. Your booking is still pending.");
    };

    const handleClose = () => {
      console.log("Payment modal closed");
    };

    // Add event listeners
    window.addEventListener("paystack:success", handleSuccess);
    window.addEventListener("paystack:cancel", handleCancel);
    window.addEventListener("paystack:close", handleClose);

    // Cleanup
    return () => {
      window.removeEventListener("paystack:success", handleSuccess);
      window.removeEventListener("paystack:cancel", handleCancel);
      window.removeEventListener("paystack:close", handleClose);
    };
  }, [verifyPayment]);

  const summaryRef = useRef<HTMLDivElement>(null);

  const tickets = ticketsParam
    ? (JSON.parse(ticketsParam as string) as {
        type: string;
        quantity: number;
      }[])
    : [];

  const selectedShowtime = Array.isArray(showtime)
    ? showtime[0]
    : showtime || "";

  const showtimeData = movie?.showtimes.find(
    (st) => st._id === selectedShowtime
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      termsAccepted: true,
      couponCode: "",
    },
  });

  // Update form with session data when available
  useEffect(() => {
    if (session?.user && status === "authenticated") {
      form.setValue("firstName", session.user.firstName || "");
      form.setValue("lastName", session.user.lastName || "");
      form.setValue("email", session.user.email || "");
      form.setValue("phone", session.user.phone || "");
    }
  }, [session, status, form]);

  const calculateTicketPrice = (
    ticket: Movie["showtimes"][0]["tickets"][0]
  ) => {
    if (!ticket?.basePrice) return 0;
    if (!ticket.hasDiscount || !ticket.discountType || !ticket.discountValue) {
      return ticket.basePrice;
    }
    if (ticket.discountType === "percentage") {
      return ticket.basePrice * (1 - ticket.discountValue / 100);
    }
    return ticket.basePrice - ticket.discountValue;
  };

  const ticketTotal = tickets.reduce((sum, ticket) => {
    const ticketData = showtimeData?.tickets.find((t) => t._id === ticket.type);
    return (
      sum +
      ticket.quantity * (ticketData ? calculateTicketPrice(ticketData) : 0)
    );
  }, 0);

  const bookingFee = ticketTotal * 0.02;
  const totalPrice = ticketTotal + bookingFee;

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    if (!movie || !showtimeData) {
      toast.error("Invalid movie or showtime data");
      return;
    }

    const bookingData: CreateBookingRequest = {
      type: "movies_and_cinema",
      listing: String(movie?._id),
      details: {
        showtime: selectedShowtime,
        tickets: tickets.map((ticket) => ({
          ticketTypeId: ticket.type, // ticket.type is now ticket._id
          quantity: ticket.quantity,
        })),
      },
      couponCode: formData.couponCode || undefined,
    };

    createBooking(bookingData, {
      onSuccess: async (response) => {
        setCouponCode("");

        // Payment data is now included in the booking response
        const paymentData = (
          response?.data as {
            payment?: { access_code: string; reference: string };
          }
        )?.payment;
        console.log("Payment data:", paymentData);
        if (paymentData) {
          // Open Paystack modal with access code
          const popup = new PaystackPop();
          popup.resumeTransaction(
            paymentData.access_code,
            {
              onSuccess: (response: { reference: string }) => {
                console.log("Payment successful:", response);
                // Verify payment
                verifyPayment(response.reference, {
                  onSuccess: (verifyResponse) => {
                    console.log("Verification response:", verifyResponse);
                    if (verifyResponse.data.status === "success") {
                      toast.success(
                        "Payment successful! Your booking has been confirmed."
                      );
                      setSuccessModal(true);
                    } else {
                      toast.error(
                        "Payment verification failed. Please contact support."
                      );
                    }
                  },
                  onError: (error) => {
                    console.error("Payment verification error:", error);
                    toast.error(
                      "Payment verification failed. Please contact support."
                    );
                  },
                });
              },
              onCancel: () => {
                console.log("Payment cancelled");
                toast.info("Payment cancelled. Your booking is still pending.");
              },
              onClose: () => {
                console.log("Payment modal closed");
              },
            }
          );
        } else {
          toast.error(
            "Booking created but payment initialization failed. Please contact support."
          );
          setSuccessModal(true);
        }
      },
      onError: (error) => {
        toast.error(
          error?.message ?? "Failed to create booking. Please try again."
        );
      },
    });
  };

  useGSAP(() => {
    if (!movie) return; // Skip animations if movie data isn't available

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current.querySelector(".checkout-image"),
          { opacity: 0, scale: 1.1 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
        );
      }

      if (formRef.current) {
        gsap.fromTo(
          formRef.current.querySelectorAll(".form-field"),
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

      if (summaryRef.current) {
        gsap.fromTo(
          summaryRef.current.querySelectorAll(".summary-item"),
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.4,
          }
        );
      }

      // Hover effect for checkout button
      const button = document.querySelector(".checkout-button");
      if (button) {
        button.addEventListener("mouseenter", () =>
          gsap.to(button, { scale: 1.03, duration: 0.2, ease: "power1.inOut" })
        );
        button.addEventListener("mouseleave", () =>
          gsap.to(button, { scale: 1, duration: 0.2, ease: "power1.inOut" })
        );
      }
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [movie]);

  if (isLoading || status === "loading") {
    return <p className="text-center py-20 text-[13px]">Loading...</p>;
  }

  if (!movie || !showtimeData) {
    return (
      <p className="text-center py-20 text-red-500 text-[13px]">
        Error: Invalid movie or showtime
      </p>
    );
  }

  const formatShowtime = (dateStr: string, timeStr: string) => {
    const date = moment(dateStr);
    const [hours, minutes] = timeStr.split(":");
    date.set({ hour: +hours, minute: +minutes });
    return date.format("ddd MMM D h:mmA");
  };

  return (
    <>
      <BookingConfirmation
        showModal={successModal}
        toggleModal={() => setSuccessModal(!successModal)}
        type="movies_and_cinema"
      />
      <section className="bg-muted/60">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-primary text-lg font-semibold">Checkout</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <div
                    className="bg-white rounded-lg shadow-xs p-6"
                    ref={formRef}
                  >
                    <h1 className="text-primary text-base font-semibold">
                      Personal Information
                    </h1>
                    <div className="mt-6 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="form-field">
                              <FormLabel className="text-xs text-gray-700 font-medium">
                                First Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter first name"
                                  {...field}
                                  className="!py-5 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all ease-in-out duration-200 disabled:bg-muted"
                                  aria-required="true"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="form-field">
                              <FormLabel className="text-gray-700 text-xs font-medium">
                                Last Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter last name"
                                  {...field}
                                  className="!py-5 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all ease-in-out duration-200 disabled:bg-muted"
                                  aria-required="true"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="form-field">
                            <FormLabel className="text-gray-700 text-xs font-medium">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter email address"
                                type="email"
                                {...field}
                                className="!py-5 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all ease-in-out duration-200 disabled:bg-muted"
                                aria-required="true"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="form-field">
                            <FormLabel className="text-gray-700 text-xs font-medium">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter phone number"
                                type="tel"
                                {...field}
                                className="!py-5 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all ease-in-out duration-200 disabled:bg-muted"
                                aria-required="true"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="termsAccepted"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3 form-field">
                            <FormControl>
                              <Checkbox
                                id="terms"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-required="true"
                              />
                            </FormControl>
                            <Label
                              htmlFor="terms"
                              className="text-gray-700 text-xs font-normal leading-relaxed"
                            >
                              Receive notifications about this booking. Message
                              and data rates may apply.
                            </Label>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-xs p-6">
                    <h1 className="text-primary text-base font-semibold">
                      Important Notice
                    </h1>
                    <div className="mt-6">
                      <ul className="space-y-4">
                        <li className="text-gray-600 text-xs/relaxed">
                          1. Arrive 15 minutes early to ensure seating.
                        </li>
                        <li className="text-gray-600 text-xs/relaxed">
                          2. No refunds or exchanges after booking confirmation.
                        </li>
                        <li className="text-gray-600 text-xs/relaxed">
                          3. Food and drinks from outside are not permitted.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 space-y-4">
                  <div className="bg-white rounded-lg shadow-xs overflow-hidden">
                    <div className="relative w-full h-52" ref={imageRef}>
                      <Image
                        src={movie.images?.[0] || "/placeholder.jpg"}
                        alt={movie.title}
                        className="object-cover checkout-image"
                        fill
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-primary/10" />
                    </div>
                    <div className="space-y-4 p-6">
                      <div>
                        <h1 className="text-primary text-sm font-semibold">
                          {movie.title}
                        </h1>
                        <p className="text-gray-700 text-[11px] mt-1.5">
                          {movie.cinema.title}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-gray-500 text-[11px] font-medium">
                          Showtime
                        </p>
                        <p className="text-xs font-medium">
                          {formatShowtime(
                            showtimeData.date,
                            showtimeData.startTime
                          )}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-gray-500 text-[11px] font-medium">
                          Tickets
                        </p>
                        <p className="text-xs font-medium">
                          {tickets
                            .map((t) => {
                              const ticketData = showtimeData.tickets.find(
                                (ticket) => ticket._id === t.type
                              );
                              return `${ticketData?.name} (x${t.quantity})`;
                            })
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-lg space-y-4 shadow-xs p-6"
                    ref={summaryRef}
                  >
                    <h1 className="text-primary text-sm font-semibold mb-4">
                      Payment Summary
                    </h1>
                    {tickets.map((ticket, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between summary-item"
                      >
                        <div>
                          <p className="text-gray-500 text-xs font-medium">
                            {
                              showtimeData.tickets.find(
                                (t) => t._id === ticket.type
                              )?.name
                            }{" "}
                            (x{ticket.quantity})
                          </p>
                        </div>
                        <p className="text-[13px] font-semibold">
                          NGN{" "}
                          {formatPrice(
                            calculateTicketPrice(
                              showtimeData.tickets.find(
                                (t) => t._id === ticket.type
                              )!
                            ) * ticket.quantity
                          )}
                        </p>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex items-start justify-between summary-item">
                      <div>
                        <p className="text-xs font-medium">Total</p>
                      </div>
                      <p className="text-[13px] font-semibold">
                        NGN {formatPrice(totalPrice)}
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2.5 summary-item">
                      <p className="!text-xs !font-medium">
                        Use coupon or promo code
                      </p>
                      <FormField
                        control={form.control}
                        name="couponCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="!py-5 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all ease-in-out duration-200"
                                placeholder="Enter code here"
                                {...field}
                                value={couponCode}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setCouponCode(e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full text-xs transition-colors ease-in-out duration-300 cursor-pointer !py-5 checkout-button"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <span>
                          <Loader2 className="animate-spin" />
                        </span>
                      ) : (
                        <span>Checkout</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </>
  );
};

export default Page;
