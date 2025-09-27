import mongoose, { Document } from "mongoose";

interface IBooking extends Document {
  explorer: mongoose.Types.ObjectId;
  type: string;
  listing: mongoose.Types.ObjectId;
  details: any;
  totalAmount: number;
  serviceFee: number;
  coupon: { code?: string; discount: number; applied: boolean };
  status: "requested" | "pending" | "confirmed" | "cancelled" | "failed";
  payment?: mongoose.Types.ObjectId;
  paymentStatus?: "pending" | "paid" | "failed";
  paymentReference?: string;
  code: string;
  // Vendor approval fields for accommodation bookings
  vendorApproval?: {
    status: "pending" | "approved" | "rejected";
    message?: string;
    approvedAt?: Date;
    rejectedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    explorer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      validate: {
        validator: function (this: IBooking, value: any) {
          switch (this.type) {
            case "accommodations":
              return (
                typeof value.checkInDate === "string" &&
                typeof value.checkOutDate === "string" &&
                // value.checkInDate < value.checkOutDate &&
                typeof value.guests === "number" &&
                value.guests > 0 &&
                (value.roomType === undefined || typeof value.roomType === "string")
              );
            case "movies_and_cinema":
              return (
                // value.showtime instanceof Date &&
                // typeof value.seatNumber === "string"
                typeof value.showtime === "string"
              );
            case "leisure":
              return (
                Array.isArray(value.tickets) &&
                value.tickets.every(
                  (ticket: any) =>
                    typeof ticket.ticketTypeId === "string" &&
                    typeof ticket.quantity === "number" &&
                    ticket.quantity > 0
                )
              );
            case "events":
              return (
                Array.isArray(value.tickets) &&
                value.tickets.every(
                  (ticket: any) =>
                    typeof ticket.ticketTypeId === "string" &&
                    typeof ticket.quantity === "number" &&
                    ticket.quantity > 0
                )
              );
            default:
              return false;
          }
        },
        message: "Invalid details structure for booking type: {VALUE}",
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    serviceFee: {
      type: Number,
      required: true,
      min: 0,
    },
    coupon: {
      code: { type: String },
      discount: { type: Number, min: 0, default: 0 },
      applied: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ["requested", "pending", "confirmed", "cancelled", "failed"],
      required: true,
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentReference: {
      type: String,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    vendorApproval: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
      },
      message: {
        type: String,
      },
      approvedAt: {
        type: Date,
      },
      rejectedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);