import mongoose, { Schema } from "mongoose";

const accommodationSchema = new mongoose.Schema(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    accommodationCode: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    accommodationType: {
      type: String,
      enum: ["shortlet", "hotel"],
      required: true,
    },
    buildingType: {
      type: String,
    },
    propertySize: {
      type: String,
    },
    bedrooms: {
      type: Number,
      min: 0,
    },
    bathrooms: {
      type: Number,
      min: 0,
    },
    parkingSpaces: {
      type: Number,
      required: true,
      min: 0,
    },
    maxGuests: {
      type: Number,
      min: 1,
    },
    images: [
      {
        type: String,
      },
    ],

    // Location & Access
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
    },
    checkInTime: {
      type: String,
      required: true,
    },
    checkOutTime: {
      type: String,
      required: true,
    },

    // Amenities
    amenities: {
      type: Map,
      of: Boolean,
      default: {},
    },

    // Pricing
    basePrice: {
      type: Number,
      min: 0,
    },
    hasDiscount: {
      type: Boolean,
      default: false,
    },
    discountType: {
      type: String,
      enum: ["fixed", "percentage"],
    },
    discountValue: {
      type: Number,
      min: 0,
    },
    rooms: [
      {
        name: {
          type: String,
          required: true,
        },
        availableRooms: {
          type: Number,
          required: true,
          min: 1,
        },
        basePrice: {
          type: Number,
          required: true,
          min: 0,
        },
        hasDiscount: {
          type: Boolean,
          default: false,
        },
        discountType: {
          type: String,
          enum: ["fixed", "percentage"],
        },
        discountValue: {
          type: Number,
          min: 0,
        },
      },
    ],

    // Additional Details
    tags: [
      {
        type: String,
      },
    ],
    whatsIncluded: [
      {
        type: String,
      },
    ],

    // Policies
    smokingPolicy: {
      type: String,
      enum: ["allowed", "notAllowed"],
      required: true,
    },
    petPolicy: {
      type: String,
      enum: ["allowed", "notAllowed"],
      required: true,
    },
    childrenPolicy: {
      type: String,
      enum: ["allowed", "notAllowed"],
      required: true,
    },
    houseRules: {
      type: String,
    },
    // Metadata
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["available", "unavailable", "booked"],
      default: "available",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Accommodation =
  mongoose.models.Accommodation ||
  mongoose.model("Accommodation", accommodationSchema);