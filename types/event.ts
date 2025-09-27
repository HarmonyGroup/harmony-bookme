export interface EventListing {
  _id?: string
  eventCode: string
  slug: string
  title: string
  description: string
  summary: string
  category: string
  eventType: string
  format: "in-person" | "virtual"
  pricingType: "free" | "paid"
  freeEventCapacity?: number

  // Date & Time
  startDate: string
  endDate: string
  isRecurring?: boolean
  recurringPattern?: {
    frequency: "daily" | "weekly" | "monthly"
    interval: number
    endDate?: Date
  }

  // Location & Venue (flat fields to match model)
  venueName?: string
  country?: string
  state?: string
  city?: string
  zipcode?: string
  streetAddress?: string

  // Virtual Details (flat fields to match model)
  virtualPlatform?: string
  virtualMeetingLink?: string
  virtualMeetingId?: string
  virtualAccessInstructions?: string
  virtualCapacity?: number

  // Tickets & Pricing (optional for free events)
  tickets?: TicketType[]

  // Event Details
  images?: string[]
  ageRestriction?: number
  dressCode?: string
  whatsIncluded?: string[]
  requirements?: string[]
  tags?: string[]

  // Policies
  childrenPolicy: "allowed" | "notAllowed"
  petPolicy: "allowed" | "notAllowed"
  smokingPolicy: "allowed" | "notAllowed"

  // Metadata
  organizer: string // ObjectId as string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  status: "draft" | "published" | "cancelled" | "completed"
}

export interface TicketType {
  _id: string
  name: string
  description?: string
  basePrice: number
  pricingStructure: "perPerson" | "perGroup" | "flatFee"
  capacity: number
  soldCount?: number
  saleStartDate?: Date
  saleEndDate?: Date
  hasDiscount?: boolean
  discountType?: "fixed" | "percentage"
  discountValue?: number
  minimumBookingsRequired?: number
}

export interface CreateEventListingRequest {
  title: string
  description: string
  summary: string
  category: string
  eventType: string
  format: "in-person" | "virtual"
  pricingType: "free" | "paid"
  freeEventCapacity?: number

  startDate: Date
  endDate: Date
  isRecurring?: boolean
  recurringPattern?: {
    frequency: "daily" | "weekly" | "monthly"
    interval: number
    endDate?: Date
  }

  // Location & Venue (flat fields to match model)
  venueName?: string
  country?: string
  state?: string
  city?: string
  zipcode?: string
  streetAddress?: string

  // Virtual Details (flat fields to match model)
  virtualPlatform?: string
  virtualMeetingLink?: string
  virtualMeetingId?: string
  virtualAccessInstructions?: string
  virtualCapacity?: number

  tickets?: TicketType[] // Optional for free events

  images?: string[]
  ageRestriction?: number
  dressCode?: string
  whatsIncluded?: string[]
  requirements?: string[]
  tags?: string[]

  // Policies
  childrenPolicy: "allowed" | "notAllowed"
  petPolicy: "allowed" | "notAllowed"
  smokingPolicy: "allowed" | "notAllowed"
}

export interface CreateEventListingResponse {
  success: boolean
  data: EventListing
  message: string
}

export interface ApiError {
  success: false
  error: string
  message: string
}