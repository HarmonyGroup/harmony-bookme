import mongoose, { Document } from "mongoose";

interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  explorer: mongoose.Types.ObjectId;
  paystackReference: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "abandoned";
  paymentMethod: string;
  customerEmail: string;
  customerName: string;
  metadata?: any;
  paidAt?: Date;
  // Settlement tracking fields
  settlementId?: string; // Paystack settlement ID
  settlementStatus?: "pending" | "settled" | "failed";
  vendorAmount?: number; // Amount vendor receives after commission
  platformAmount?: number; // Platform commission (gross amount before fees)
  paystackFees?: number; // Total Paystack fees paid
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    explorer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paystackReference: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "abandoned"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    paidAt: {
      type: Date,
    },
    // Settlement tracking fields
    settlementId: {
      type: String,
    },
    settlementStatus: {
      type: String,
      enum: ["pending", "settled", "failed"],
      default: "pending",
    },
    vendorAmount: {
      type: Number,
      min: 0,
    },
    platformAmount: {
      type: Number,
      min: 0,
    },
    paystackFees: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ vendor: 1 });
paymentSchema.index({ explorer: 1 });
// Note: paystackReference already has unique: true which creates an index automatically
paymentSchema.index({ status: 1 });
paymentSchema.index({ customerEmail: 1 });
paymentSchema.index({ vendor: 1, status: 1 }); // Compound index for vendor performance queries
paymentSchema.index({ settlementId: 1 }); // Index for settlement queries
paymentSchema.index({ vendor: 1, settlementStatus: 1 }); // Compound index for settlement tracking

export const Payment =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentSchema);
