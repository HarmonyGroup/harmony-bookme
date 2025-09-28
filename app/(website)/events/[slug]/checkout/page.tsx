"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
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
import { useCreateBooking } from "@/services/explorer/booking";
import { CreateBookingRequest } from "@/types/booking";
import { toast } from "sonner";
import { useGetEvent } from "@/services/public/event";
import { EventListing } from "@/types/event";
import moment from "moment";
import { Loader2 } from "lucide-react";
import BookingConfirmation from "@/components/website/events/BookingConfirmation";
import { useVerifyPayment } from "@/services/explorer/payment";
import {
  calculateTicketTotal,
  formatPrice as formatTicketPrice,
} from "@/utils/ticket-pricing";
import PaystackPop from "@paystack/inline-js";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AuthModal from "@/components/auth/AuthModal";
import UnauthorizedIcon from "@/public/assets/unauthorized-icon-2.png";
import { formatPrice } from "@/lib/utils";

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
  couponCode: z.string().optional(),
});

const Page = ({ params, searchParams }: PageProps) => {
  const resolvedParams = React.use(params);
  const resolvedSearchParams = React.use(searchParams);
  const { slug } = resolvedParams;
  const { tickets: ticketsParam } = resolvedSearchParams;
  const { data: session, status } = useSession();
  const { data, isLoading } = useGetEvent({ slug });
  const { mutate: createBooking, isPending } = useCreateBooking();
  const { mutate: verifyPayment, isPending: isVerifyingPayment } =
    useVerifyPayment();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const event = data?.data as EventListing | undefined;

  const formRef = useRef<HTMLDivElement>(null);
  // const imageRef = useRef<HTMLDivElement>(null);

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
  // const tokensRef = useRef<HTMLDivElement>(null);

  const tickets = ticketsParam
    ? (JSON.parse(ticketsParam as string) as {
        type: string;
        quantity: number;
      }[])
    : [];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
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

  // Calculate subtotal for display (with discounts applied)
  const ticketSubtotal = tickets.reduce((sum, ticket) => {
    const ticketData = event?.tickets?.find((t) => t._id === ticket.type);
    if (!ticketData) return sum;
    return sum + calculateTicketTotal(ticketData, ticket.quantity);
  }, 0);

  // The actual total will be calculated by the booking API
  // This is just for display purposes
  const displayTotal = ticketSubtotal;

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    if (!event) {
      toast.error("Invalid event data");
      return;
    }

    const bookingData: CreateBookingRequest = {
      type: "events",
      listing: String(event._id),
      details: {
        tickets: tickets.map((ticket) => ({
          ticketTypeId: ticket.type, // ticket.type now contains the actual _id
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
        if (paymentData) {
          // Open Paystack modal with access code
          const popup = new PaystackPop();
          popup.resumeTransaction(paymentData.access_code, {
            onSuccess: (response) => {
              console.log("Payment successful:", response);
              // Verify payment
              verifyPayment(response.reference, {
                onSuccess: (verifyResponse) => {
                  console.log("Verification response:", verifyResponse);
                  if (verifyResponse.data.status === "success") {
                    // toast.success(
                    //   "Payment successful! Your booking has been confirmed."
                    // );
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
          });
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

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-[83vh] bg-white flex items-center justify-center">
        <span className="resource-loader"></span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <AuthModal
          showModal={showAuthModal}
          toggleModal={() => setShowAuthModal(!showAuthModal)}
        />
        <div className="min-h-[83vh] bg-white flex flex-col items-center justify-center">
          <Image src={UnauthorizedIcon} alt="" className="size-16 mb-6" />
          <h1 className="text-xl font-semibold text-primary mb-2">
            You&apos;re not logged in
          </h1>
          <p className="text-gray-600 text-[13px] mb-4">
            Please login or create an account to complete this booking.
          </p>
          <Button
            onClick={() => setShowAuthModal(true)}
            className="bg-primary text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer"
          >
            Login
          </Button>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-muted/60 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Event Not Found
          </h2>
          <p className="text-gray-600">
            The event you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BookingConfirmation
        showModal={successModal}
        toggleModal={() => setSuccessModal(!successModal)}
        type="events"
      />
      <section className="bg-white py-6">
        <div className="min-h-screen mx-auto w-full max-w-7xl px-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="text-gray-600 text-[11px] md:text-xs">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-gray-600 text-[11px] md:text-xs">
                <BreadcrumbLink href="/events">Events</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-gray-600 text-[11px] md:text-xs">
                <BreadcrumbLink href={`/events/${slug}`}>
                  {event.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="!text-primary text-[11px] md:text-xs">
                <BreadcrumbPage className="!text-primary text-[11px] md:text-xs font-medium">
                  Checkout
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-primary text-base/relaxed md:text-xl/relaxed font-semibold mt-8">
            Checkout
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24">
                {/* Left side */}
                <div className="col-span-1 md:col-span-1 space-y-4">
                  <div ref={formRef}>
                    <h1 className="text-primary text-[13px] md:text-[15px] font-semibold">
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
                                  disabled={status === "authenticated"}
                                  className="checkout-form !py-5 !text-xs !font-normal placeholder:text-gray-500 placeholder:!text-xs placeholder:!font-normal focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all ease-in-out duration-200 disabled:!bg-muted"
                                  style={{ fontSize: '12px' }}
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
                                  disabled={status === "authenticated"}
                                  className="checkout-form !py-5 !text-xs !font-normal placeholder:text-gray-500 placeholder:!text-xs placeholder:!font-normal focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all ease-in-out duration-200 disabled:!bg-muted"
                                  style={{ fontSize: '12px' }}
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
                                disabled={status === "authenticated"}
                                className="checkout-form !py-5 !text-xs !font-normal placeholder:text-gray-500 placeholder:!text-xs placeholder:!font-normal focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all ease-in-out duration-200 disabled:!bg-muted"
                                style={{ fontSize: '12px' }}
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
                                  disabled={
                                    status === "authenticated" &&
                                    !!session?.user?.phone
                                  }
                                  className="checkout-form !py-5 !text-xs !font-normal placeholder:text-gray-500 placeholder:!text-xs placeholder:!font-normal focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all ease-in-out duration-200 disabled:!bg-muted"
                                  style={{ fontSize: '12px' }}
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200/60 block md:hidden" />

                {/* Right side */}
                <div className="col-span-1 space-y-4">
                  {/* <div className="bg-white rounded-lg shadow-xs overflow-hidden">
                    <div className="relative w-full h-52" ref={imageRef}>
                      <Image
                        src={event.images?.[0] || "/placeholder.jpg"}
                        alt={event.title}
                        className="object-cover checkout-image"
                        fill
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-primary/10" />
                    </div>
                    <div className="space-y-4 p-6">
                      <div>
                        <h1 className="text-primary text-sm font-semibold">
                          {event.title}
                        </h1>
                        <p className="text-gray-700 text-[11px] mt-1.5">
                          {event.format === "virtual"
                            ? event.virtualPlatform
                            : event.venueName}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-gray-500 text-[11px] font-medium">
                              Date
                            </p>
                            <p className="text-xs font-medium">
                              {formatDate(event.startDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-gray-500 text-[11px] font-medium">
                              Time
                            </p>
                            <p className="text-xs font-medium">
                              {formatTime(event.startDate)} -{" "}
                              {formatTime(event.endDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.format === "virtual" ? (
                            <Video className="w-4 h-4 text-gray-500" />
                          ) : (
                            <MapPin className="w-4 h-4 text-gray-500" />
                          )}
                          <div>
                            <p className="text-gray-500 text-[11px] font-medium">
                              {event.format === "virtual"
                                ? "Platform"
                                : "Location"}
                            </p>
                            <p className="text-xs font-medium">
                              {event.format === "virtual"
                                ? event.virtualPlatform
                                : `${event.city}, ${event.state}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-gray-500 text-[11px] font-medium">
                              Category
                            </p>
                            <p className="text-xs font-medium">
                              {event.category}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-gray-500 text-[11px] font-medium">
                          Selected Options
                        </p>
                        <p className="text-xs font-medium">
                          {tickets
                            .map((t) => {
                              const ticketData = event.tickets?.find(
                                (ticket) => ticket._id === t.type
                              );
                              return `${ticketData?.name} (x${t.quantity})`;
                            })
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div> */}

                  <div className="bg-white space-y-4" ref={summaryRef}>
                    <h1 className="text-primary text-[13px] md:text-[15px] font-semibold mb-6">
                      Order Details
                    </h1>

                    <div className="flex items-center gap-2.5">
                      <div className="relative size-20 rounded-lg overflow-hidden bg-gray-200">
                        <Image
                          src={event.images?.[0] || "/placeholder.jpg"}
                          alt={event.title}
                          fill
                          className="object-cover"
                          loading="eager"
                        />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-primary text-[13px] md:text-[15px] font-semibold line-clamp-1">
                          {event.title}
                        </h4>
                        <p className="text-gray-600 text-[11px] md:text-xs line-clamp-1">
                          {event?.streetAddress}
                        </p>
                        <p className="text-gray-600 text-[11px] md:text-xs line-clamp-1">
                          {moment(event.startDate).format("dddd, MMMM Do, YYYY [|] h:mm A")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      {tickets.map((ticket, index) => {
                        const ticketData = event.tickets?.find(
                          (t) => t._id === ticket.type
                        );
                        const hasDiscount =
                          ticketData?.hasDiscount &&
                          ticketData?.discountType &&
                          ticketData?.discountValue;
                        const totalPrice = ticketData
                          ? calculateTicketTotal(ticketData, ticket.quantity)
                          : 0;
                        const originalTotal =
                          (ticketData?.basePrice || 0) * ticket.quantity;

                        return (
                          <div
                            key={index}
                            className="flex items-start justify-between summary-item"
                          >
                            <div>
                              <p className="text-gray-700 text-xs font-medium">
                                {ticketData?.name} (x{ticket.quantity})
                              </p>
                              {hasDiscount && (
                                <p className="text-xs text-green-600 mt-1">
                                  {ticketData.discountType === "percentage"
                                    ? `${ticketData.discountValue}% off`
                                    : `₦${ticketData.discountValue} off`}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-primary text-[13px] font-semibold">
                                NGN {formatPrice(totalPrice)}
                              </p>
                              {hasDiscount && (
                                <p className="text-xs text-gray-500 line-through mt-1">
                                  {formatTicketPrice(originalTotal)}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Separator className="my-4 bg-gray-200/60"/>
                    <div className="flex items-start justify-between summary-item">
                      <div>
                        <p className="text-gray-600 text-xs md:text-[13px] font- font-medium">Total</p>
                      </div>
                      <p className="text-primary text-[13px] font-semibold">
                        NGN {formatPrice(displayTotal)}
                      </p>
                    </div>
                    <Separator className="my-4 bg-gray-200/60"/>
                    <div className="space-y-2.5 summary-item">
                      <p className="text-gray-600 text-xs">
                        Have coupon or promo code?
                      </p>
                      <FormField
                        control={form.control}
                        name="couponCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="checkout-form !py-5 !text-xs !font-normal placeholder:text-gray-500 placeholder:!text-xs placeholder:!font-normal focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all ease-in-out duration-200"
                                style={{ fontSize: '12px' }}
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
                      className="w-full text-[13px] font-medium transition-colors ease-in-out duration-300 cursor-pointer rounded-lg !py-6 checkout-button bg-primary hover:bg-primary/90"
                      disabled={
                        isPending ||
                        isVerifyingPayment
                      }
                    >
                      {isPending || isVerifyingPayment ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin size-5" />
                          {/* {isVerifyingPayment
                            ? "Verifying Payment..."
                            : "Processing..."} */}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {/* <CreditCard className="w-4 h-4" /> */}
                          Pay Now
                        </span>
                      )}
                    </Button>
                    {/* <div
                      className="bg-sky-100 text-primary text-[11px]/relaxed rounded-md p-2"
                      ref={tokensRef}
                    >
                      <p>
                        🎉 You&apos;ll receive{" "}
                        <span className="font-semibold">3 tokens</span> when you
                        complete this event booking.
                      </p>
                    </div> */}
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