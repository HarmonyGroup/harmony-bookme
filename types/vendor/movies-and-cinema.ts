interface Auditorium {
  _id?: string;
  screenId: string;
  name: string;
  screenType: "Standard" | "Premium" | "IMAX" | "Dolby";
  capacity: number;
}

interface Socials {
  facebookUrl?: string;
  instagramUrl?: string;
  xUrl?: string;
  tiktokUrl?: string;
  websiteUrl?: string;
}

interface OperatingHours {
  startTime?: string;
  endTime?: string;
}

export interface Cinema {
  _id?: string;
  slug: string;
  cinemaCode: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  socials?: Socials;
  images?: string[];
  country: string;
  state: string;
  city: string;
  streetAddress: string;
  operatingHours?: OperatingHours;
  auditoriums: Auditorium[];
  amenities?: string[];
  petPolicy: "yes" | "no";
  childrenPolicy: "yes" | "no";
  ageRestriction?: number;
  houseRules?: string;
  vendor: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Movie {
  _id?: string;
  slug: string;
  movieCode: string;
  title: string;
  description: string;
  genre: string[];
  duration?: number;
  releaseDate: string;
  rating: string;
  images: string[];
  trailerUrl?: string;
  cinema: Cinema;
  showtimes: {
    _id: string;
    date: string;
    startTime: string;
    endTime?: string;
    auditorium: string;
    tickets: {
      _id: string;
      name: string;
      basePrice?: number;
      hasDiscount?: boolean;
      discountType?: "percentage" | "fixed";
      discountValue?: number;
      soldCount: number;
      capacity: number;
    }[];
  }[];
  language?: string;
  subtitles?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCinemaRequest {
  title: string;
  description: string;
  email: string;
  phone: string;
  socials?: Socials;
  images?: string[];
  country: string;
  state: string;
  city: string;
  streetAddress: string;
  operatingHours?: OperatingHours;
  auditoriums: Auditorium[];
  amenities?: string[];
  petPolicy: "yes" | "no";
  childrenPolicy: "yes" | "no";
  ageRestriction?: number;
  houseRules?: string;
}

export interface CreateCinemaResponse {
  success: true;
  data: Cinema;
  message: string;
}

export interface VendorCinemaResponse {
  success: boolean;
  data: Cinema;
  message: string;
}

export interface useGetVendorCinemasParams {
  page: number;
  limit: number;
  search?: string;
}

export interface useGetVendorMoviesParams {
  page: number;
  limit: number;
  search?: string;
}

export interface VendorCinemasResponse {
  success: boolean;
  data: Cinema[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VendorMoviesResponse {
  success: boolean;
  data: Movie[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VendorMovieResponse {
  success: boolean;
  data: Movie;
  message: string
}

export interface CreateMovieRequest {
  title: string;
  description: string;
  genre: string[];
  duration?: number;
  releaseDate: string;
  rating: string;
  images: string[];
  trailerUrl?: string;
  cinema: string;
  showtimes: {
    date: Date;
    startTime: string;
    auditorium: string;
    tickets: {
      name: string;
      basePrice?: number;
      hasDiscount?: boolean;
      discountType?: "percentage" | "fixed";
      discountValue?: number;
      capacity: number;
    }[];
  }[];

  language?: string;
  subtitles?: string;
}

export interface CreateMovieResponse {
  success: true;
  data: Movie;
  message: string;
}

export interface GetMoviesTodayResponse {
  success: boolean;
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message: string;
}

export interface useGetMoviesTodayParams {
  page: number;
  limit: number;
  search?: string;
  cinema?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}