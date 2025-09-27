import mongoose, { type Document } from "mongoose";

export interface ISettlement extends Document {
  settlementId: string; // Paystack settlement ID
  vendor: mongoose.Types.ObjectId; // Reference to User (vendor)
  amount: number; // Total settlement amount
  currency: string;
  status: "pending" | "success" | "failed" | "cancelled";
  settlementDate: Date;
  settlementBank: string;
  settlementAccount: string;
  paystackData: {
    settlementId: string;
    amount: number;
    status: string;
    settlementDate: string;
    settlementBank: string;
    settlementAccount: string;
    settlementSchedule: string;
  };
  payments: mongoose.Types.ObjectId[]; // Array of Payment IDs that contributed to this settlement
  createdAt: Date;
  updatedAt: Date;
}

const SettlementSchema = new mongoose.Schema<ISettlement>(
  {
    settlementId: {
      type: String,
      required: true,
      unique: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },
    settlementDate: {
      type: Date,
      required: true,
    },
    settlementBank: {
      type: String,
      required: true,
    },
    settlementAccount: {
      type: String,
      required: true,
    },
    paystackData: {
      settlementId: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      settlementDate: {
        type: String,
        required: true,
      },
      settlementBank: {
        type: String,
        required: true,
      },
      settlementAccount: {
        type: String,
        required: true,
      },
      settlementSchedule: {
        type: String,
        required: true,
      },
    },
    payments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    }],
  },
  { timestamps: true }
);

// Indexes for performance
SettlementSchema.index({ vendor: 1, settlementDate: -1 });
// Note: settlementId already has unique: true which creates an index automatically
SettlementSchema.index({ status: 1 });

const Settlement = mongoose.models.Settlement || mongoose.model<ISettlement>("Settlement", SettlementSchema);

export default Settlement;
