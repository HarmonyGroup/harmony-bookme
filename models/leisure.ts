import mongoose, { Schema, Document } from 'mongoose';

export interface ILeisureListing extends Document {
  vendor: mongoose.Types.ObjectId;
  slug: string;
  leisureCode: string;
  title: string;
  description: string;
  shortSummary: string;
  category: string;
  subcategory: string;
  highlights: string[];
  eventDateType: 'single' | 'multiple' | 'recurring';
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  venueName: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  addressDetails: string;
  tickets: {
    _id: mongoose.Types.ObjectId;
    name: string;
    pricingStructure: 'perPerson' | 'perGroup' | 'flatFee';
    basePrice: number;
    capacity: number;
    hasDiscount?: boolean;
    discountType?: 'percentage' | 'fixed';
    discountValue?: number;
    minimumBookingsRequired?: number;
    soldCount: number;
  }[];
  images: string[];
  ageRestriction: string;
  requirements: string;
  tags: string[];
  dressCode: string;
  inclusions: string[];
  childrenPolicy: 'allowed' | 'notAllowed' | 'specific';
  petPolicy: 'allowed' | 'notAllowed' | 'specific';
  accessibilityFeatures: string[];
  termsAndConditions: string;
  status: 'draft' | 'active' | 'inactive' | 'rejected';
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LeisureListingSchema = new Schema<ILeisureListing>({
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
  leisureCode: {
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
  shortSummary: {
    type: String,
    required: true,
    maxlength: 200,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  highlights: [{
    type: String,
    required: true,
  }],
  eventDateType: {
    type: String,
    enum: ['single', 'multiple', 'recurring'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  venueName: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  zipcode: {
    type: String,
    required: true,
    trim: true,
  },
  addressDetails: {
    type: String,
    required: true,
    trim: true,
  },
  tickets: [{
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: true,
    },
    pricingStructure: {
      type: String,
      enum: ['perPerson', 'perGroup', 'flatFee'],
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    hasDiscount: {
      type: Boolean,
      default: false,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
    },
    discountValue: {
      type: Number,
      min: 0,
    },
    minimumBookingsRequired: {
      type: Number,
      min: 1,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
  }],
  images: [{
    type: String,
    required: true,
  }],
  ageRestriction: {
    type: String,
    required: true,
    trim: true,
  },
  requirements: {
    type: String,
    required: true,
    trim: true,
  },
  tags: [{
    type: String,
    required: true,
    trim: true,
  }],
  dressCode: {
    type: String,
    required: true,
    trim: true,
  },
  inclusions: [{
    type: String,
    required: true,
    trim: true,
  }],
  childrenPolicy: {
    type: String,
    enum: ['allowed', 'notAllowed', 'specific'],
    required: true,
  },
  petPolicy: {
    type: String,
    enum: ['allowed', 'notAllowed', 'specific'],
    required: true,
  },
  accessibilityFeatures: [{
    type: String,
    required: true,
  }],
  termsAndConditions: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'rejected'],
    default: 'draft',
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Create indexes for better query performance
LeisureListingSchema.index({ vendor: 1, status: 1 });
LeisureListingSchema.index({ category: 1, subcategory: 1 });
LeisureListingSchema.index({ city: 1, state: 1, country: 1 });
LeisureListingSchema.index({ startDate: 1, endDate: 1 });

// export default mongoose.models.Leisure || mongoose.model<ILeisureListing>('Leisure', LeisureListingSchema);
export const Leisure = mongoose.models.Leisure || mongoose.model<ILeisureListing>('Leisure', LeisureListingSchema);