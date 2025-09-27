interface VendorData {
  businessName: string;
  email: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  streetAddress?: string;
  avatar?: string;
}

interface GetVendorResponse {
  success: boolean;
  message: string;
  data: VendorData;
}

interface UpdateVendorData {
  businessName: string;
  email: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  streetAddress?: string;
  avatar?: string;
}

interface UpdateVendorResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    businessName: string;
    email: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
    streetAddress?: string;
    avatar?: string;
  };
}

interface ApiError {
  success: false;
  error: string;
  message: string;
}