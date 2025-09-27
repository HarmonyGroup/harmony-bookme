import mongoose, { Schema, Document } from "mongoose";
import { User } from "next-auth";

// Interface for Movie document
interface IMovie extends Document {
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
  cinema: mongoose.Types.ObjectId;
  showtimes: {
    date: Date;
    startTime: string;
    endTime?: string;
    auditorium: mongoose.Types.ObjectId;
    tickets: {
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
  vendor: User;
}

const MovieSchema: Schema<IMovie> = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    movieCode: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Movie title is required"],
      minlength: [2, "Movie title must be at least 2 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
      trim: true,
    },
    genre: {
      type: [String],
      required: [true, "At least one genre is required"],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "At least one genre is required",
      },
    },
    duration: {
      type: Number,
      min: [30, "Duration must be at least 30 minutes"],
    },
    releaseDate: {
      type: String,
      required: [true, "Release date is required"],
    },
    rating: {
      type: String,
      required: [true, "Rating is required"],
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: (arr: string[]) =>
          arr.length > 0 &&
          arr.every((url) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url)),
        message: "At least one valid image URL is required",
      },
    },
    trailerUrl: {
      type: String,
      validate: {
        validator: (url: string) =>
          !url || /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url),
        message: "Trailer URL must be a valid URL",
      },
    },
    cinema: {
      type: Schema.Types.ObjectId,
      ref: "Cinema",
      required: [true, "Cinema is required"],
    },
    showtimes: {
      type: [
        {
          date: {
            type: Date,
            required: [true, "Date is required"],
          },
          startTime: {
            type: String,
            required: [true, "Start time is required"],
            match: [
              /^([01]\d|2[0-3]):[0-5]\d$/,
              "Start time must be in HH:MM format",
            ],
          },
          endTime: {
            type: String,
            match: [
              /^([01]\d|2[0-3]):[0-5]\d$/,
              "End time must be in HH:MM format",
            ],
          },
          auditorium: {
            type: Schema.Types.ObjectId,
            ref: "Auditoriums",
            required: [true, "Auditorium is required"],
          },
          tickets: {
            type: [
              {
                name: {
                  type: String,
                  required: [true, "Ticket name is required"],
                  trim: true,
                },
                basePrice: {
                  type: Number,
                  min: [0, "Price must be positive"],
                },
                hasDiscount: {
                  type: Boolean,
                  default: false,
                },
                discountType: {
                  type: String,
                  enum: {
                    values: ["percentage", "fixed"],
                    message: 'Discount type must be "percentage" or "fixed"',
                  },
                },
                discountValue: {
                  type: Number,
                  min: [0, "Discount value must be positive"],
                },
                soldCount: {
                  type: Number,
                  default: 0,
                  min: [0, "Sold count must be positive"],
                },
                capacity: {
                  type: Number,
                  required: [true, "Capacity is required"],
                  min: [1, "Capacity must be positive"],
                },
              },
            ],
            required: [true, "At least one ticket is required"],
            validate: {
              validator: (arr: any[]) => arr.length > 0,
              message: "At least one ticket is required",
            },
          },
        },
      ],
      required: [true, "At least one showtime is required"],
      validate: {
        validator: (arr: any[]) => arr.length > 0,
        message: "At least one showtime is required",
      },
    },
    language: {
      type: String,
      trim: true,
    },
    subtitles: {
      type: String,
      trim: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Movie =
  mongoose.models.Movie || mongoose.model<IMovie>("Movie", MovieSchema);

export default Movie;