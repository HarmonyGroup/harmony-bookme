export interface AccommodationListing {
  _id?: string;
  slug: string;
  accommodationCode: string;
  title: string;
  description: string;
  accommodationType: "shortlet" | "hotel";
  buildingType?: string;
  propertySize?: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces: number;
  maxGuests?: number;
  images?: string[];

  // Location & Access
  country: string;
  state: string;
  city: string;
  streetAddress: string;
  zipCode?: string;
  checkInTime: string;
  checkOutTime: string;

  // Amenities
  amenities?: Record<string, boolean>;

  // Pricing
  basePrice?: number;
  hasDiscount?: boolean;
  discountType?: "fixed" | "percentage";
  discountValue?: number;
  rooms?: Array<{
    name: string;
    availableRooms?: number;
    basePrice?: number;
    hasDiscount?: boolean;
    discountType?: "fixed" | "percentage";
    discountValue?: number;
  }>;

  // Additional Details
  tags?: string[];
  whatsIncluded?: string[];

  // Policies
  smokingPolicy: "allowed" | "notAllowed";
  petPolicy: "allowed" | "notAllowed";
  childrenPolicy: "allowed" | "notAllowed";
  houseRules?: string;

  // Metadata
  vendor: string; // ObjectId as string
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  status: "available" | "unavailable" | "booked";
}

export interface CreateAccommodationListingRequest {
  title: string;
  description: string;
  accommodationType: "shortlet" | "hotel";
  buildingType?: string;
  propertySize?: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces: number;
  maxGuests?: number;
  images?: string[];

  country: string;
  state: string;
  city: string;
  streetAddress: string;
  zipCode?: string;
  checkInTime: string;
  checkOutTime: string;

  amenities?: Record<string, boolean>;

  basePrice?: number;
  hasDiscount?: boolean;
  discountType?: "fixed" | "percentage";
  discountValue?: number;
  rooms?: Array<{
    name: string;
    availableRooms?: number;
    basePrice?: number;
    hasDiscount?: boolean;
    discountType?: "fixed" | "percentage";
    discountValue?: number;
  }>;

  // Additional Details
  tags?: string[];
  whatsIncluded?: string[];

  smokingPolicy: "allowed" | "notAllowed";
  petPolicy: "allowed" | "notAllowed";
  childrenPolicy: "allowed" | "notAllowed";
  houseRules?: string;
}

export interface CreateAccommodationListingResponse {
  success: boolean;
  data: AccommodationListing;
  message: string;
}

export interface UpdateAccommodationStatusRequest {
  accommodationId: string;
  status: "available" | "booked" | "unavailable";
}

export interface UpdateAccommodationStatusResponse {
  success: true;
  data: {
    _id: string;
    status: UpdateAccommodationStatusRequest["status"];
  };
  message: string;
}

export interface UpdateAccommodationRequest {
  title: string;
  description: string;
  accommodationType: "shortlet" | "hotel";
  buildingType?: string;
  propertySize?: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces: number;
  maxGuests?: number;
  images?: string[];

  country: string;
  state: string;
  city: string;
  streetAddress: string;
  zipCode?: string;
  checkInTime: string;
  checkOutTime: string;

  amenities?: Record<string, boolean>;

  basePrice?: number;
  hasDiscount?: boolean;
  discountType?: "fixed" | "percentage";
  discountValue?: number;
  rooms?: Array<{
    name: string;
    availableRooms?: number;
    basePrice?: number;
    hasDiscount?: boolean;
    discountType?: "fixed" | "percentage";
    discountValue?: number;
  }>;

  tags?: string[];
  whatsIncluded?: string[];

  smokingPolicy: "allowed" | "notAllowed";
  petPolicy: "allowed" | "notAllowed";
  childrenPolicy: "allowed" | "notAllowed";
  houseRules?: string;
}

export interface UpdateAccommodationResponse {
  success: boolean;
  data: AccommodationListing;
  message: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}