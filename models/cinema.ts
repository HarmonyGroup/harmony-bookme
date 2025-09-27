import mongoose, { Schema } from "mongoose";

const cinemaSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    cinemaCode: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Cinema name is required"],
      trim: true,
      minlength: [2, "Cinema name must be at least 2 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      match: [/^[^@]+@[^@]+\.[^@]+$/, "Invalid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      minlength: [5, "Phone number must be at least 5 characters"],
    },
    socials: {
      facebookUrl: { type: String, trim: true, default: "" },
      instagramUrl: { type: String, trim: true, default: "" },
      xUrl: { type: String, trim: true, default: "" },
      tiktokUrl: { type: String, trim: true, default: "" },
      websiteUrl: { type: String, trim: true, default: "" },
    },
    images: {
      type: [String],

      default: [],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      minlength: [1, "Country is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      minlength: [1, "State is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [1, "City is required"],
    },
    streetAddress: {
      type: String,
      required: [true, "Street address is required"],
      trim: true,
      minlength: [1, "Street address is required"],
    },
    operatingHours: {
      startTime: { type: String, trim: true, default: "" },
      endTime: { type: String, trim: true, default: "" },
    },
    auditoriums: {
      type: [
        {
          screenId: {
            type: String,
            required: [true, "Auditorium ID is required"],
            trim: true,
            minlength: [1, "Auditorium ID must be at least 1 character"],
          },
          name: {
            type: String,
            required: [true, "Auditorium name is required"],
            trim: true,
            minlength: [1, "Auditorium name must be at least 1 character"],
          },
          screenType: {
            type: String,
            required: [true, "Auditorium type is required"],
            enum: {
              values: ["Standard", "Premium", "IMAX", "Dolby", "Others"],
              message:
                "Auditorium type must be one of: Standard, Premium, IMAX, Dolby",
            },
          },
          capacity: {
            type: Number,
            required: [true, "Capacity is required"],
            min: [1, "Capacity must be a positive number"],
          },
        },
      ],
      required: [true, "At least one auditorium is required"],
      validate: {
        validator: function (arr: unknown[]) {
          return arr.length > 0;
        },
        message: "At least one auditorium is required",
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    petPolicy: {
      type: String,
      required: [true, "Pet policy is required"],
      enum: {
        values: ["yes", "no"],
        message: 'Pet policy must be either "yes" or "no"',
      },
    },
    childrenPolicy: {
      type: String,
      required: [true, "Children policy is required"],
      enum: {
        values: ["yes", "no"],
        message: 'Children policy must be either "yes" or "no"',
      },
    },
    ageRestriction: {
      type: Number,
      min: [0, "Age restriction cannot be negative"],
      max: [100, "Age restriction cannot exceed 100"],
    },
    houseRules: {
      type: String,
      trim: true,
      default: "",
    },
    vendor: {
      type: Schema.Types.ObjectId,
      required: [true, "Vendor ID is required"],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Cinema =
  mongoose.models.Cinema || mongoose.model("Cinema", cinemaSchema);