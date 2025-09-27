"use client";

import React, { Fragment, useState, useEffect } from "react";
import { useGetAccommodation } from "@/services/public/accommodation";
import { useCreateBooking } from "@/services/explorer/booking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  // Home,
  // Wifi,
  // Coffee,
  // Shield,
  // Utensils,
  // Dumbbell,
  // Waves,
  // Tv,
  // Wind,
  // WashingMachine,
  // ParkingCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  BathtubIcon,
  BedIcon,
  ClockIcon,
  StarIcon,
} from "@phosphor-icons/react";
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
import { useSession } from "next-auth/react";
import AuthModal from "@/components/auth/AuthModal";
import AccommodationBookingSuccessModal from "@/components/website/accommodations/AccommodationBookingSuccessModal";

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
`;

// Room type with MongoDB _id field
interface RoomWithId {
  _id?: string;
  name: string;
  availableRooms?: number;
  basePrice?: number;
  hasDiscount?: boolean;
  discountType?: "fixed" | "percentage";
  discountValue?: number;
}

interface AccommodationPageProps {
  params: Promise<{ slug: string }>;
}

const Page = ({ params }: AccommodationPageProps) => {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  const { status } = useSession();

  const { data, isLoading } = useGetAccommodation({ slug });
  const accommodation = data?.data;

  // Booking state
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number | "">("");
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");

  // UI state
  const [authModal, setAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  // const [showAllAmenities, setShowAllAmenities] = useState(false);
  // const [isFavorited, setIsFavorited] = useState(false);

  // Booking mutation
  const createBookingMutation = useCreateBooking();

  // Carousel effect
  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const isBookNowDisabled =
    !checkIn ||
    !checkOut ||
    !guests ||
    (accommodation?.accommodationType === "hotel" && !selectedRoomType) ||
    createBookingMutation.isPending;

  // Calculate pricing
  const calculatePrice = () => {
    if (!accommodation || !checkIn || !checkOut)
      return { basePrice: 0, totalPrice: 0, nights: 0 };

    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    let basePrice = 0;
    if (accommodation.accommodationType === "shortlet") {
      basePrice = accommodation.basePrice || 0;
      // Apply accommodation discount if applicable
      if (
        accommodation.hasDiscount &&
        accommodation.discountType &&
        accommodation.discountValue
      ) {
        if (accommodation.discountType === "percentage") {
          basePrice = basePrice * (1 - accommodation.discountValue / 100);
        } else {
          basePrice = Math.max(0, basePrice - accommodation.discountValue);
        }
      }
    } else if (
      accommodation.accommodationType === "hotel" &&
      selectedRoomType
    ) {
      const selectedRoom = accommodation.rooms?.find(
        (room, index) =>
          (room as RoomWithId)._id === selectedRoomType ||
          index.toString() === selectedRoomType
      );
      if (selectedRoom) {
        basePrice = selectedRoom.basePrice || 0;
        // Apply room discount if applicable
        if (
          selectedRoom.hasDiscount &&
          selectedRoom.discountType &&
          selectedRoom.discountValue
        ) {
          if (selectedRoom.discountType === "percentage") {
            basePrice = basePrice * (1 - selectedRoom.discountValue / 100);
          } else {
            basePrice = Math.max(0, basePrice - selectedRoom.discountValue);
          }
        }
      }
    }

    return {
      basePrice,
      totalPrice: basePrice * nights,
      nights,
    };
  };

  const { totalPrice } = calculatePrice();

  const handleBookNow = () => {
    if (isBookNowDisabled || !accommodation) return;

    if (status === "unauthenticated") {
      setAuthModal(true);
      return;
    }

    // Validate guests count
    if (
      typeof guests === "number" &&
      accommodation.maxGuests &&
      guests > accommodation.maxGuests
    ) {
      toast.error(
        `Maximum ${accommodation.maxGuests} guests allowed for this accommodation.`
      );
      return;
    }

    const bookingData = {
      type: "accommodations" as const,
      listing: accommodation._id || "",
      details: {
        checkInDate: checkIn!.toISOString(),
        checkOutDate: checkOut!.toISOString(),
        guests: guests as number,
        ...(accommodation.accommodationType === "hotel" &&
          selectedRoomType && {
            roomType: selectedRoomType,
          }),
      },
    };

    createBookingMutation.mutate(bookingData, {
      onSuccess: () => {
        setShowSuccessModal(true);
      },
      onError: (error) => {
        toast.error(
          error.message || "Failed to submit booking request. Please try again."
        );
      },
    });
  };

  // const handleShare = () => {
  //   if (navigator.share) {
  //     navigator.share({
  //       title: accommodation?.title,
  //       text: accommodation?.description,
  //       url: window.location.href,
  //     });
  //   } else {
  //     navigator.clipboard.writeText(window.location.href);
  //     toast.success("Link copied to clipboard!");
  //   }
  // };

  // const handleFavorite = () => {
  //   setIsFavorited(!isFavorited);
  //   toast.success(
  //     isFavorited ? "Removed from favorites" : "Added to favorites"
  //   );
  // };

  // const getAmenityIcon = (amenity: string) => {
  //   const iconMap: { [key: string]: React.ReactNode } = {
  //     wifi: <Wifi className="w-5 h-5" />,
  //     parking: <ParkingCircle className="w-5 h-5" />,
  //     pool: <Waves className="w-5 h-5" />,
  //     gym: <Dumbbell className="w-5 h-5" />,
  //     tv: <Tv className="w-5 h-5" />,
  //     ac: <Wind className="w-5 h-5" />,
  //     kitchen: <Utensils className="w-5 h-5" />,
  //     laundry: <WashingMachine className="w-5 h-5" />,
  //     security: <Shield className="w-5 h-5" />,
  //     coffee: <Coffee className="w-5 h-5" />,
  //   };
  //   return iconMap[amenity.toLowerCase()] || <Home className="w-5 h-5" />;
  // };

  const getPolicyIcon = (policy: string) => {
    return policy === "allowed" ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[83vh] bg-white flex items-center justify-center">
        <span className="resource-loader"></span>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-muted/60 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Accommodation Not Found
          </h2>
          <p className="text-gray-600">
            The accommodation you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <AuthModal
        showModal={authModal}
        toggleModal={() => setAuthModal(!authModal)}
      />
      <AccommodationBookingSuccessModal
        showModal={showSuccessModal}
        toggleModal={() => setShowSuccessModal(!showSuccessModal)}
      />
      <section className="bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-6">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="text-gray-700 text-xs">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-gray-700 text-xs">
                <BreadcrumbLink href="/accommodations">
                  Accommodations
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="!text-primary text-xs">
                <BreadcrumbPage className="!text-primary text-xs font-medium">
                  {accommodation.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Image Carousel */}
          <div className="relative mt-4">
            {accommodation.images && accommodation.images.length > 0 ? (
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
                  {accommodation.images.map((image, index) => (
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
                            alt={`${accommodation.title} - Image ${index + 1}`}
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
                  {accommodation.images.map((_, index) => (
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
                  alt={accommodation.title}
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
                    {accommodation.title}
                  </h1>
                  <div className="flex items-center gap-2.5">
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
                  </div>
                </div>

                <Separator className="bg-gray-200/60" />

                {/* Accommodation Description */}
                <div className="bg-white space-y-2">
                  <h4 className="text-[15px] font-semibold text-primary">
                    About this place
                  </h4>
                  <div>
                    <p className="text-gray-700 text-[13px]/relaxed">
                      {accommodation.description}
                    </p>
                  </div>
                </div>

                <Separator className="bg-gray-200/60" />

                {/* Property Details */}
                <div className="bg-white space-y-6">
                  <h4 className="text-[15px] font-semibold text-primary">
                    Property details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <BedIcon
                          size={24}
                          weight="duotone"
                          className="text-sky-800"
                        />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-semibold text-primary">
                          Bedrooms
                        </h3>
                        <p className="text-[13px] text-gray-600 mt-1">
                          {accommodation?.bedrooms} bedrooms
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <BathtubIcon
                          size={24}
                          weight="duotone"
                          className="text-sky-800"
                        />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-semibold text-primary">
                          Bathrooms
                        </h3>
                        <p className="text-[13px] text-gray-600 mt-1">
                          {accommodation?.bathrooms} bathrooms
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <ClockIcon
                          size={24}
                          weight="duotone"
                          className="text-sky-800"
                        />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-semibold text-primary">
                          Check In
                        </h3>
                        <p className="text-[13px] text-gray-600 mt-1">
                          {accommodation?.checkInTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <ClockIcon
                          size={24}
                          weight="duotone"
                          className="text-sky-800"
                        />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-semibold text-primary">
                          Check Out
                        </h3>
                        <p className="text-[13px] text-gray-600 mt-1">
                          {accommodation?.checkOutTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Bed className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {accommodation.bedrooms || 0}
                      </p>
                      <p className="text-xs text-gray-600">Bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Home className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {accommodation.bathrooms || 0}
                      </p>
                      <p className="text-xs text-gray-600">Bathrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {accommodation.parkingSpaces}
                      </p>
                      <p className="text-xs text-gray-600">Parking</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {accommodation.maxGuests}
                      </p>
                      <p className="text-xs text-gray-600">Max Guests</p>
                    </div>
                  </div>
                </div> */}
                </div>

                <Separator className="bg-gray-200/60" />

                {/* Room Types (for hotels) */}
                {/* {accommodation.accommodationType === "hotel" &&
                accommodation.rooms &&
                accommodation.rooms.length > 0 && (
                  <div className="bg-white space-y-2">
                    <h4 className="text-[15px] font-semibold text-primary">
                      Available Rooms
                    </h4>
                    <div className="space-y-4">
                      {accommodation.rooms.map((room, index) => (
                        <div
                          key={index}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedRoomType === index.toString()
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() =>
                            setSelectedRoomType(index.toString())
                          }
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {room.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {room.availableRooms} rooms available
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                {formatPrice(room.basePrice || 0)}
                              </p>
                              <p className="text-xs text-gray-600">
                                per night
                              </p>
                              {room.hasDiscount && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  {room.discountType === "percentage"
                                    ? `${room.discountValue}% off`
                                    : `₦${room.discountValue} off`}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}

                {/* Amenities */}
                {/* <div className="bg-white space-y-2">
                <h4 className="text-[15px] font-semibold text-primary">
                  What this place offers
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(accommodation.amenities || {})
                    .filter(([_, value]) => value)
                    .slice(0, showAllAmenities ? undefined : 12)
                    .map(([amenity, _]) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {getAmenityIcon(amenity)}
                        <span className="text-gray-600 text-sm font-medium capitalize">
                          {amenity.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                    ))}
                </div>
                {Object.keys(accommodation.amenities || {}).filter(
                  (key) => accommodation.amenities?.[key]
                ).length > 12 && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="mt-4 text-primary text-sm font-medium"
                  >
                    {showAllAmenities ? "Show less" : "Show all amenities"}
                    <ChevronDown
                      className={`w-4 h-4 ml-2 transition-transform ${
                        showAllAmenities ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                )}
              </div> */}

                {/* Policies */}
                <div className="bg-white space-y-6">
                  <h4 className="text-[15px] font-semibold text-primary">
                    House rules
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {getPolicyIcon(accommodation.smokingPolicy)}
                      <span className="text-gray-700 text-[13px]/relaxed">
                        Smoking{" "}
                        {accommodation.smokingPolicy === "allowed"
                          ? "allowed"
                          : "not allowed"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {getPolicyIcon(accommodation.petPolicy)}
                      <span className="text-gray-700 text-[13px]/relaxed">
                        Pets{" "}
                        {accommodation.petPolicy === "allowed"
                          ? "allowed"
                          : "not allowed"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {getPolicyIcon(accommodation.childrenPolicy)}
                      <span className="text-gray-700 text-[13px]/relaxed">
                        Children{" "}
                        {accommodation.childrenPolicy === "allowed"
                          ? "allowed"
                          : "not allowed"}
                      </span>
                    </div>
                    {accommodation.houseRules && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-[13px] text-gray-700">
                          {accommodation.houseRules}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
                      Make Reservation
                    </CardTitle>
                    <p className="text-gray-700 text-xs font-medium">
                      Select your dates and preferences
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Pricing Display */}
                    {/* <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {formatPrice(basePrice)}
                    </div>
                    <div className="text-sm text-gray-600">per night</div>
                    {accommodation.hasDiscount && (
                      <Badge variant="destructive" className="mt-2">
                        {accommodation.discountType === "percentage"
                          ? `${accommodation.discountValue}% off`
                          : `₦${accommodation.discountValue} off`}
                      </Badge>
                    )}
                  </div> */}

                    {/* Check-in Date */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-xs font-medium">
                        Check-in Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full text-gray-500 text-xs !py-6 cursor-pointer justify-between hover:bg-muted/50 transition-all duration-300 ease-in-out"
                          >
                            {checkIn
                              ? format(checkIn, "PPP")
                              : "Select check-in date"}
                            <CalendarIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Check-out Date */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-xs font-medium">
                        Check-out Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full text-gray-500 text-xs !py-6 cursor-pointer justify-between hover:bg-muted/50 transition-all duration-300 ease-in-out"
                          >
                            {checkOut
                              ? format(checkOut, "PPP")
                              : "Select check-out date"}
                            <CalendarIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            disabled={(date) =>
                              date < new Date() ||
                              (checkIn ? date <= checkIn : false)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Guests */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-xs font-medium">
                        Number of Guests
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        max={accommodation.maxGuests}
                        value={guests}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            setGuests("");
                          } else {
                            const numValue = parseInt(value);
                            if (!isNaN(numValue) && numValue > 0) {
                              setGuests(numValue);
                            }
                          }
                        }}
                        className="!py-6 !text-xs font-normal placeholder:text-gray-500 placeholder:text-xs placeholder:font-normal focus-visible:ring-0 focus-visible:border-primary shadow-none transition-all ease-in-out duration-200 disabled:bg-muted"
                        placeholder="Enter number of guests"
                      />
                      {typeof guests === "number" &&
                        accommodation.maxGuests &&
                        guests > accommodation.maxGuests && (
                          <p className="text-red-500 text-xs">
                            Maximum {accommodation.maxGuests} guests allowed
                          </p>
                        )}
                    </div>

                    {/* Room Type Selection (for hotels) */}
                    {accommodation.accommodationType === "hotel" && (
                      <div className="space-y-2">
                        <Label className="text-gray-700 text-xs font-medium">
                          Room Type
                        </Label>
                        <Select
                          value={selectedRoomType}
                          onValueChange={setSelectedRoomType}
                        >
                          <SelectTrigger className="w-full text-xs !py-6">
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            {accommodation.rooms?.map((room, index) => (
                              <SelectItem
                                key={(room as RoomWithId)._id || index}
                                value={(room as RoomWithId)._id || index.toString()}
                              >
                                {room.name} - {formatPrice(room.basePrice || 0)}
                                /night
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Separator />

                    {/* Price Summary */}
                    {checkIn && checkOut && (
                      <div className="space-y-2">
                        {/* <p className="text-gray-700 text-xs font-medium">
                          Price Summary
                        </p> */}
                        <div className="space-y-2">
                          {/* <div className="flex justify-between text-[13px] font-medium">
                            <span>
                              {formatPrice(basePrice)} × {nights} nights
                            </span>
                            <span>{formatPrice(totalPrice)}</span>
                          </div> */}
                          <Separator />

                          {/* <div className="flex justify-between font-semibold text-sm">
                            <span>Total</span>
                            <span>{formatPrice(totalPrice)}</span>
                          </div> */}

                          <div className="bg-muted border border-dashed border-gray-200 rounded-lg shadow-xs p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700 text-xs font-medium">
                                Total
                              </span>
                              <span className="text-primary font-semibold text-sm">
                                NGN {formatPrice(totalPrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleBookNow}
                      className="bg-primary text-[13px] font-semibold w-full cursor-pointer !py-6 disabled:bg-primary/90"
                      disabled={isBookNowDisabled}
                    >
                      {createBookingMutation.isPending ? (
                        <>Please Wait...</>
                      ) : (
                        "Make Reservation"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Mobile Floating Action Button */}
          <div className="fixed bottom-6 right-6 lg:hidden z-50">
            <Button
              size="lg"
              className="rounded-full shadow-lg w-14 h-14 p-0"
              onClick={() => {
                const bookingSection =
                  document.getElementById("booking-section");
                if (bookingSection) {
                  bookingSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <Calendar className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Page;
