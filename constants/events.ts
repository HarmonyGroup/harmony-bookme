export const EVENT_CATEGORIES = [
  "Business & Professional",
  "Food & Drink",
  "Health & Wellness",
  "Music & Entertainment",
  "Arts & Culture",
  "Sports & Fitness",
  "Technology",
  "Education & Learning",
  "Community & Social",
  "Travel & Outdoor",
  "Fashion & Beauty",
  "Auto, Boat & Air",
  "Charity & Causes",
  "Religion & Spirituality",
  "Family & Kids",
  "Dating & Relationships",
  "Hobbies & Special Interest",
  "Home & Lifestyle",
  "Other",
] as const

export const EVENT_FORMATS = [
  { value: "in-person", label: "In-Person Event" },
  { value: "virtual", label: "Virtual Event" },
] as const

export const EVENT_TYPES = [
  "Conference",
  "Workshop",
  "Seminar",
  "Concert",
  "Festival",
  "Exhibition",
  "Networking",
  "Party",
  "Class",
  "Tour",
  "Competition",
  "Meetup",
  "Launch",
  "Fundraiser",
  "Other",
] as const

export const VIRTUAL_PLATFORMS = [
  "Zoom",
  "Google Meet",
  "Microsoft Teams",
  "WebEx",
  "GoToMeeting",
  "YouTube Live",
  "Facebook Live",
  "Twitch",
  "Custom Platform",
  "Other",
] as const

export const CANCELLATION_POLICIES = [
  {
    value: "flexible",
    label: "Flexible",
    description: "Full refund until 24 hours before event",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "Full refund until 7 days before event",
  },
  {
    value: "strict",
    label: "Strict",
    description: "No refunds after purchase",
  },
] as const

export const DRESS_CODES = [
  "Casual",
  "Business Casual",
  "Business Professional",
  "Smart Casual",
  "Cocktail",
  "Black Tie",
  "White Tie",
  "Costume/Theme",
] as const

export const DISCOUNT_TYPES = [
  { value: "fixed", label: "Fixed Amount" },
  { value: "percentage", label: "Percentage" },
] as const