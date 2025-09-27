import mongoose, { type Document } from "mongoose";

interface IConfiguration extends Document {
  commissionRates: {
    events: number;
    accommodations: number;
    leisure: number;
    movies_and_cinema: number;
  };
  isActive: boolean;
  updatedBy: mongoose.Types.ObjectId;
}

const ConfigurationSchema = new mongoose.Schema<IConfiguration>(
  {
    commissionRates: {
      events: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 5, // 5% default commission for events
      },
      accommodations: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 5, // 7% default commission for accommodations
      },
      leisure: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 5, // 6% default commission for leisure
      },
      movies_and_cinema: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 5, // 8% default commission for movies and cinema
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure only one active configuration exists
ConfigurationSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

const Configuration = mongoose.models.Configuration || mongoose.model<IConfiguration>("Configuration", ConfigurationSchema);

export default Configuration;
