export interface LeisureListing {
  _id?: string;
  slug: string;
  leisureCode: string;
  vendor?: string;
  title: string;
  description: string;
  shortSummary: string;
  category: string;
  subcategory: string;
  highlights: string[];
  eventDateType: 'single' | 'multiple' | 'recurring';
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venueName: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  addressDetails: string;
  tickets: {
    _id: string;
    name: string;
    pricingStructure: 'perPerson' | 'perGroup' | 'flatFee';
    basePrice: number;
    capacity: number;
    hasDiscount?: boolean;
    discountType?: 'percentage' | 'fixed';
    discountValue?: number;
    minimumBookingsRequired?: number;
  }[];
  images: string[];
  ageRestriction: string;
  requirements: string;
  tags: string[];
  dressCode: string;
  inclusions: string[];
  childrenPolicy: 'allowed' | 'notAllowed' | 'specific';
  petPolicy: 'allowed' | 'notAllowed' | 'specific';
  accessibilityFeatures: string[];
  termsAndConditions: string;
  status?: 'draft' | 'active' | 'inactive' | 'rejected';
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeisureListingResponse {
  message: string;
  data: LeisureListing;
}

export interface LeisureListingsResponse {
  data: LeisureListing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateLeisureListingRequest {
  title: string;
  description: string;
  shortSummary: string;
  category: string;
  subcategory: string;
  highlights: string[];
  eventDateType: 'single' | 'multiple' | 'recurring';
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venueName: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  addressDetails: string;
  tickets: {
    _id: string;
    name: string;
    pricingStructure: 'perPerson' | 'perGroup' | 'flatFee';
    basePrice: number;
    capacity: number;
    hasDiscount?: boolean;
    discountType?: 'percentage' | 'fixed';
    discountValue?: number;
    minimumBookingsRequired?: number;
  }[];
  images: string[];
  ageRestriction: string;
  requirements: string;
  tags: string[];
  dressCode: string;
  inclusions: string[];
  childrenPolicy: 'allowed' | 'notAllowed' | 'specific';
  petPolicy: 'allowed' | 'notAllowed' | 'specific';
  accessibilityFeatures: string[];
  termsAndConditions: string;
}

export interface UpdateLeisureListingRequest extends Partial<CreateLeisureListingRequest> {}

export interface LeisureListingFilters {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
}
