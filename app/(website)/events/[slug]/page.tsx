"use client";

import React, { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetEvent } from "@/services/public/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";
import Image from "next/image";
import moment from "moment";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  CalendarDotsIcon,
  MapPinLineIcon,
  StarIcon,
} from "@phosphor-icons/react";
import {
  calculateTicketPrice,
  calculateTicketTotal,
  formatPrice as formatTicketPrice,
} from "@/utils/ticket-pricing";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { MdArrowDropDown } from "react-icons/md";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";
import AuthModal from "@/components/auth/AuthModal";

// Add custom CSS animations
const customStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }
  
  .animate-slide-in-left {
    animation: slideInLeft 0.6s ease-out forwards;
  }
  
  .animate-slide-in-right {
    animation: slideInRight 0.6s ease-out forwards;
  }
  
  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
  
  .image-hover-zoom {
    transition: transform 0.3s ease;
  }
  
  .image-hover-zoom:hover {
    transform: scale(1.05);
  }
  
  .stagger-animation > * {
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .stagger-animation > *:nth-child(1) { animation-delay: 0.1s; }
  .stagger-animation > *:nth-child(2) { animation-delay: 0.2s; }
  .stagger-animation > *:nth-child(3) { animation-delay: 0.3s; }
  .stagger-animation > *:nth-child(4) { animation-delay: 0.4s; }
  .stagger-animation > *:nth-child(5) { animation-delay: 0.5s; }
`;

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

const Page = ({ params }: EventPageProps) => {
  const { data: session, status } = useSession();
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  const router = useRouter();

  const { data, isLoading } = useGetEvent({ slug });
  const event = data?.data;

  const [authModal, setAuthModal] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<
    { type: string; quantity: number }[]
  >([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    if (!carouselApi) return;

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const handleAddTicket = (ticketId: string) => {
    if (!event) return;
    if (!selectedTickets.find((t) => t.type === ticketId)) {
      const ticket = event.tickets?.find((t) => t._id === ticketId);
      const updatedTickets = [
        ...selectedTickets,
        { type: ticketId, quantity: 1 },
      ];
      setSelectedTickets(updatedTickets);
      toast.success(`${ticket?.name} ticket added`);
    }
  };

  const handleRemoveTicket = (ticketId: string) => {
    if (!event) return;
    const ticket = event.tickets?.find((t) => t._id === ticketId);
    const updatedTickets = selectedTickets.filter((t) => t.type !== ticketId);
    setSelectedTickets(updatedTickets);
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
    }
  };

  const handleBooking = () => {
    if (status === "unauthenticated" || status === "loading" || !session) {
      setAuthModal(true);
      return;
    }

    if (event?.pricingType === "free") {
      router.push(`/events/${slug}/checkout`);
      toast.success("Proceeding to checkout");
      return;
    }

    if (selectedTickets.length === 0) {
      toast.error("Please select at least one ticket type");
      return;
    }

    const query = new URLSearchParams({
      tickets: JSON.stringify(selectedTickets),
    }).toString();

    router.push(`/events/${slug}/checkout?${query}`);
    toast.success("Proceeding to checkout");
  };

  // Generate redirect URL for auth modal
  const generateRedirectUrl = () => {
    if (event?.pricingType === "free") {
      return `/events/${slug}/checkout`;
    }

    if (selectedTickets.length === 0) {
      return `/events/${slug}/checkout`;
    }

    const query = new URLSearchParams({
      tickets: JSON.stringify(selectedTickets),
    }).toString();

    return `/events/${slug}/checkout?${query}`;
  };

  const formatDate = (date: string | Date) => {
    return moment(date).format("MMM DD, YYYY");
  };

  const formatTime = (date: string | Date) => {
    return moment(date).format("h:mm A");
  };

  if (isLoading) {
    return (
      <div className="min-h-[83vh] bg-white flex items-center justify-center">
        <span className="resource-loader"></span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Event Not Found
          </h2>
          <p className="text-gray-600">
            The event you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/events")} className="mt-4">
            Browse Other Events
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = selectedTickets.reduce((sum, ticket) => {
    if (!event?.tickets) return sum;
    const ticketData = event.tickets.find((t) => t._id === ticket.type);
    if (!ticketData) return sum;
    return sum + calculateTicketTotal(ticketData, ticket.quantity);
  }, 0);

  return (
    <section className="bg-white py-6">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="min-h-screen bg-white max-w-7xl mx-auto px-5">
        
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-gray-700 text-[11px] md:text-xs">
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-gray-700 text-[11px] md:text-xs">
              <BreadcrumbLink href="/events">Events</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="!text-primary text-[11px] md:text-xs">
              <BreadcrumbPage className="!text-primary text-[11px] md:text-xs font-medium">
                {event.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Image Carousel */}
        <div className="relative mt-4">
          {event.images && event.images.length > 0 ? (
            <Carousel
              opts={{
                align: "center",
                loop: true,
                skipSnaps: false,
                duration: 35,
                containScroll: "trimSnaps",
              }}
              setApi={setCarouselApi}
              className="w-full relative"
            >
              <CarouselContent className="-ml-2">
                {event.images.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 basis-full sm:basis-1/2 md:basis-1/2"
                  >
                    <div
                      className={`relative rounded-lg overflow-hidden transition-all duration-500 ease-out ${
                        index === current
                          ? "w-full shadow-lg"
                          : "w-full shadow-md"
                      }`}
                    >
                      <div className="relative h-[35vh] md:h-[50vh] lg:h-[50vh] w-full">
                        <Image
                          src={image}
                          alt={`${event.title} - Image ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 ease-out"
                        />
                        <div
                          className={`absolute inset-0 transition-opacity duration-500 ${
                            index === current
                              ? "bg-gradient-to-t from-black/20 to-transparent"
                              : "bg-gradient-to-t from-black/10 to-transparent"
                          }`}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Edge-positioned carousel controls - hidden on small devices */}
              <CarouselPrevious className="hidden md:flex -left-2 -translate-x-2 text-primary bg-muted/90 hover:bg-muted/90 border-gray-200 shadow-lg cursor-pointer" />
              <CarouselNext className="hidden md:flex -right-2 translate-x-2 text-primary bg-muted/90 hover:bg-muted/90 border-gray-200 shadow-lg cursor-pointer" />

              {/* Carousel Indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {event.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === current
                        ? "bg-primary w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    onClick={() => {
                      carouselApi?.scrollTo(index);
                    }}
                  />
                ))}
              </div>
            </Carousel>
          ) : (
            <div className="relative h-64 md:h-80 lg:h-96 w-full rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop"
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-10 py-6">
            {/* Left Column - Main Content */}

            <div className="lg:col-span-2 animate-fade-in-up space-y-6">
              <div className="space-y-2">
                <h1 className="text-primary text-base/relaxed md:text-xl/relaxed font-semibold">
                  {event.title}
                </h1>
                {/* <span className="bg-sky-100 text-rose-600 text-[11px] rounded-lg px-4 py-2">{event?.category}</span> */}
                {/* <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1">
                    <StarIcon
                      weight="fill"
                      size={18}
                      className="text-yellow-500"
                    />
                    <span className="text-gray-600 text-xs font-medium">
                      4.8
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs font-medium">
                    (<span>20</span> reviews)
                  </p>
                </div> */}
              </div>

              <Separator className="bg-gray-200/60" />

              {/* Event Description */}
              <div className="bg-white space-y-2">
                <h4 className="text-[13px] md:text-[15px] font-semibold text-primary">
                  About this event
                </h4>
                <div>
                  <p className="text-gray-600 text-[11px] md:text-xs/relaxed">
                    {event.description &&
                    event.description.length > 300 &&
                    !isDescriptionExpanded
                      ? `${event.description.substring(0, 300)}...`
                      : event.description ||
                        "No description available for this event."}
                  </p>
                  {event.description && event.description.length > 300 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setIsDescriptionExpanded(!isDescriptionExpanded)
                      }
                      className="text-[11px] md:text-xs font-semibold mt-3 p-0 h-fit w-fit text-primary hover:text-primary/80 hover:bg-inherit cursor-pointer"
                    >
                      {isDescriptionExpanded ? "Show less" : "Read more"}
                    </Button>
                  )}
                </div>
              </div>

              <Separator className="bg-gray-200/60" />

              {/* Event Details */}
              <div className="bg-white space-y-6">
                <h4 className="text-[13px] md:text-[15px] font-semibold text-primary">
                  Event Details
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <CalendarDotsIcon
                          size={24}
                          weight="duotone"
                          className="text-sky-800"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs md:text-[13px] font-semibold text-primary">
                          Date & Time
                        </h3>
                        <p className="text-[11px] md:text-[13px] text-gray-600 mt-1">
                          {formatDate(event.startDate)} at{" "}
                          {formatTime(event.startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <MapPinLineIcon
                          size={24}
                          weight="duotone"
                          className="text-sky-800"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs md:text-[13px] font-semibold text-primary">
                          Location
                        </h3>
                        <p className="text-[11px] md:text-[13px] text-gray-600 mt-1">
                          {event?.venueName}, {event?.city}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  {/* {(event.ageRestriction ||
                    event.dressCode ||
                    event.whatsIncluded?.length) && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        {event.ageRestriction && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-900">
                              Age Restriction:
                            </span>
                            <span className="text-xs text-gray-600">
                              18+ years
                            </span>
                          </div>
                        )}
                        {event.dressCode && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-900">
                              Dress Code:
                            </span>
                            <span className="text-xs text-gray-600">
                              {event.dressCode}
                            </span>
                          </div>
                        )}
                        {event.whatsIncluded &&
                          event.whatsIncluded.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-gray-900">
                                What's Included:
                              </span>
                              <ul className="mt-1 space-y-1">
                                {event.whatsIncluded.map((item, index) => (
                                  <li
                                    key={index}
                                    className="text-xs text-gray-600 flex items-center gap-2"
                                  >
                                    <CheckCircleIcon
                                      size={12}
                                      className="text-green-500"
                                    />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </>
                  )} */}
                </div>
              </div>

              <Separator className="bg-gray-200/60" />
            </div>

            {/* Right Column - Booking & Info */}
            <div className="space-y-0">
              {/* Booking Card */}
              <Card
                id="booking-section"
                className="border-none !bg-white backdrop-blur-sm sticky top-4 light-shadow z-10"
              >
                <CardHeader className="">
                  <CardTitle className="text-[15px] font-semibold text-primary">
                    {event.pricingType === "free"
                      ? "Get Your Free Ticket"
                      : "Ticket Options"}
                  </CardTitle>
                  <p className="text-gray-700 text-xs font-medium">
                    {event.pricingType === "free"
                      ? "Register for this free event"
                      : "You can select multiple ticket options"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.pricingType === "free" ? (
                    <div className="space-y-4">
                      <div className="text-center p-6 bg-green-50 rounded-lg">
                        <div className="text-2xl mb-2">🎉</div>
                        <h3 className="font-semibold text-green-800 mb-2">
                          Free Event
                        </h3>
                        <p className="text-sm text-green-700">
                          This event is completely free to attend!
                        </p>
                      </div>
                      <Button
                        onClick={handleBooking}
                        className="bg-primary text-xs font-semibold w-full cursor-pointer !py-5"
                      >
                        Get Free Ticket
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Ticket Selection */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="ticket-type"
                          className="text-gray-700 text-xs font-medium"
                        >
                          Select options
                        </Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="w-full text-gray-500 text-xs !py-6 cursor-pointer justify-between hover:bg-muted/50 transition-all duration-300 ease-in-out"
                            >
                              Select options
                              <MdArrowDropDown size={100} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                            {event.tickets?.map((ticket, index) => {
                              const discountedPrice =
                                calculateTicketPrice(ticket);
                              const hasDiscount =
                                ticket.hasDiscount &&
                                ticket.discountType &&
                                ticket.discountValue;
                              return (
                                <Fragment key={index}>
                                  <DropdownMenuItem
                                    onClick={() => handleAddTicket(ticket._id)}
                                    className="cursor-pointer !px-2.5 !py-3"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="text-gray-700 text-[13px] font-medium">{ticket.name}</span>
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[13px] font-semibold text-primary">
                                          {hasDiscount ? `NGN ${formatPrice(discountedPrice)}` : `NGN ${formatPrice(ticket.basePrice)}`}
                                        </span>
                                        {hasDiscount && <span className="text-xs text-gray-500 line-through">NGN ${formatPrice(ticket.basePrice)}</span>}
                                      </div>
                                    </div>
                                  </DropdownMenuItem>
                                  {index !== (event.tickets?.length || 0) - 1 && (
                                    <Separator className="my-1" />
                                  )}
                                </Fragment>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <Separator />

                      {/* Selected Tickets List */}
                      {selectedTickets.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-gray-700 text-xs font-medium">
                            Selected options
                          </p>
                          {selectedTickets.map((ticket) => {
                            const ticketData = event.tickets?.find(
                              (t) => t._id === ticket.type
                            );
                            const hasDiscount =
                              ticketData?.hasDiscount &&
                              ticketData?.discountType &&
                              ticketData?.discountValue;
                            const totalPrice = ticketData
                              ? calculateTicketTotal(
                                  ticketData,
                                  ticket.quantity
                                )
                              : 0;
                            return (
                              <div
                                key={ticket.type}
                                className="flex items-center gap-2 border rounded-md shadow-xs p-2.5 hover:bg-muted/50 transition-colors duration-300"
                              >
                                <div className="flex-1">
                                  <p className="text-[13px] text-gray-700 font-medium">
                                    {ticketData?.name ||
                                      `Ticket ${ticket.type}`}
                                  </p>
                                  {/* {hasDiscount && (
                                    <p className="text-xs text-green-600">
                                      {ticketData.discountType === "percentage"
                                        ? `${ticketData.discountValue}% off`
                                        : `₦${ticketData.discountValue} off`}
                                    </p>
                                  )} */}
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-xs bg-white hover:bg-white cursor-pointer rounded-sm"
                                    onClick={() =>
                                      handleQuantityChange(
                                        ticket.type,
                                        ticket.quantity - 1
                                      )
                                    }
                                  >
                                    -
                                  </Button>
                                  <div className="text-xs">
                                    {ticket.quantity}
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-xs bg-white hover:bg-white cursor-pointer rounded-sm"
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
                                    size="sm"
                                    className="h-6 w-6 p-0 text-xs text-red-500 hover:bg-red-50 hover:text-red-500 cursor-pointer"
                                    onClick={() =>
                                      handleRemoveTicket(ticket.type)
                                    }
                                  >
                                    ✕
                                  </Button>
                                </div>
                                <div className="text-right space-y-1">
                                  <p className="text-[13px] font-semibold text-primary">
                                    {formatTicketPrice(totalPrice)}
                                  </p>
                                  {hasDiscount && (
                                    <p className="text-xs text-gray-500 line-through">
                                      {formatTicketPrice(
                                        (ticketData?.basePrice || 0) *
                                          ticket.quantity
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Price Summary */}
                      {selectedTickets.length > 0 && (
                        <div className="space-y-3">
                          <div className="bg-muted border border-dashed border-gray-200 rounded-lg shadow-xs p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700 text-xs font-medium">
                                Total
                              </span>
                              <span className="text-primary font-semibold text-sm">
                                {formatTicketPrice(totalPrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Book Button */}
                      <Button
                        onClick={handleBooking}
                        disabled={selectedTickets.length === 0}
                        className="bg-primary text-[13px] font-semibold w-full cursor-pointer !py-6 disabled:bg-primary/90"
                      >
                        {selectedTickets.length > 0
                          ? `Book Now - ${formatTicketPrice(totalPrice)}`
                          : "Book Now"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 lg:hidden z-50">
          <Button
            onClick={() =>
              document
                .getElementById("booking-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-primary hover:bg-primary/90 text-white rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <Calendar className="w-6 h-6" />
          </Button>
        </div>
      </div>
      <AuthModal
        showModal={authModal}
        toggleModal={() => setAuthModal(!authModal)}
        redirectUrl={generateRedirectUrl()}
      />
    </section>
  );
};

export default Page;