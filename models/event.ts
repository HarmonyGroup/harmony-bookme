import mongoose, { Schema, Document } from 'mongoose';

// Custom validation functions
const validateVirtualFields = function(this: any) {
  const format = this.format;
  const virtualFields = [
    'virtualPlatform',
    'virtualMeetingLink', 
    'virtualMeetingId',
    'virtualAccessInstructions',
    'virtualCapacity'
  ];
  
  if (format === 'virtual') {
    // Virtual fields should have values
    for (const field of virtualFields) {
      if (field === 'virtualPlatform' || field === 'virtualCapacity') {
        if (!this[field]) {
          return false;
        }
      }
    }
  } else {
    // Virtual fields should be null/undefined for in-person events
    for (const field of virtualFields) {
      if (this[field] !== null && this[field] !== undefined) {
        return false;
      }
    }
  }
  return true;
};

const validateVenueFields = function(this: any) {
  const format = this.format;
  const venueFields = [
    'venueName',
    'country',
    'state', 
    'city',
    'zipcode',
    'streetAddress'
  ];
  
  if (format === 'virtual') {
    // Venue fields should be null for virtual events
    for (const field of venueFields) {
      if (this[field] !== null && this[field] !== undefined) {
        return false;
      }
    }
  } else {
    // Venue fields should have values for in-person events
    for (const field of venueFields) {
      if (!this[field]) {
        return false;
      }
    }
  }
  return true;
};

const validateTicketsField = function(this: any) {
  const pricingType = this.pricingType;
  
  if (pricingType === 'free') {
    // Tickets should be null/empty for free events
    return !this.tickets || this.tickets.length === 0;
  } else {
    // Tickets should have values for paid events
    return this.tickets && this.tickets.length > 0;
  }
};

const eventSchema = new mongoose.Schema(
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
      index: true,
    },
    eventCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
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
    summary: {
      type: String,
      required: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      enum: ["in-person", "virtual"],
      required: true,
    },
    pricingType: {
      type: String,
      enum: ["free", "paid"],
      required: true,
    },
    freeEventCapacity: {
      type: Number,
      min: 1,
      validate: {
        validator: function(this: any) {
          const pricingType = this.pricingType;
          if (pricingType === 'free') {
            return this.freeEventCapacity && this.freeEventCapacity > 0;
          }
          return true; // Not required for paid events
        },
        message: 'Free event capacity is required for free events'
      }
    },

    // Virtual Details
    virtualPlatform: {
      type: String,
      validate: {
        validator: function(this: any) {
          const format = this.format;
          if (format === 'virtual') {
            return !!this.virtualPlatform;
          }
          return this.virtualPlatform === null || this.virtualPlatform === undefined;
        },
        message: 'Virtual platform is required for virtual events, and must be null for in-person events'
      }
    },
    virtualMeetingLink: {
      type: String,
      validate: {
        validator: function(this: any) {
          const format = this.format;
          if (format === 'virtual') {
            return true; // Optional field
          }
          return this.virtualMeetingLink === null || this.virtualMeetingLink === undefined;
        },
        message: 'Virtual meeting link must be null for in-person events'
      }
    },
    virtualMeetingId: {
      type: String,
      validate: {
        validator: function(this: any) {
          const format = this.format;
          if (format === 'virtual') {
            return true; // Optional field
          }
          return this.virtualMeetingId === null || this.virtualMeetingId === undefined;
        },
        message: 'Virtual meeting ID must be null for in-person events'
      }
    },
    virtualAccessInstructions: {
      type: String,
      validate: {
        validator: function(this: any) {
          const format = this.format;
          if (format === 'virtual') {
            return true; // Optional field
          }
          return this.virtualAccessInstructions === null || this.virtualAccessInstructions === undefined;
        },
        message: 'Virtual access instructions must be null for in-person events'
      }
    },
    virtualCapacity: {
      type: Number,
      min: 1,
      validate: {
        validator: function(this: any) {
          const format = this.format;
          if (format === 'virtual') {
            return !!this.virtualCapacity && this.virtualCapacity >= 1;
          }
          return this.virtualCapacity === null || this.virtualCapacity === undefined;
        },
        message: 'Virtual capacity is required for virtual events, and must be null for in-person events'
      }
    },

    // Date & Time (timezone removed)
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

    // Location & Venue
    venueName: {
      type: String,
      trim: true,
      validate: {
        validator: function(this: any) {
          const format = this.format;
          if (format === 'virtual') {
            return this.venueName === null || this.venueName === undefined;
          }
          return !!this.venueName;
        },
        message: 'Venue name is required for in-person events, and must be null for virtual events'
      }
    },
    country: {
      type: String,
      trim: true,
      validate: {
        validator: function(this: any) {
          const format = this.format;
          if (format === 'virtual') {
            return this.country === null || this.country === undefined;
          }
          return !!this.country;
        },
        message: 'Country is required for in-person events, and must be null for virtual events'
      }
    },
    state: {
      type: String,
      trim: true,
      validate: {
        validator: function(this: any) {
          const format = this.format;
          if (format === 'virtual') {
            return this.state === null || this.state === undefined;
          }
          return !!this.state;
        },
        message: 'State is required for in-person events, and must be null for virtual events'
      }
    },
    city: {
      type: String,
      trim: true,
      validate: {
        validator: function(this: any) {
          const format = this.format;
          if (format === 'virtual') {
            return this.city === null || this.city === undefined;
          }
          return !!this.city;
        },
        message: 'City is required for in-person events, and must be null for virtual events'
      }
    },
    zipcode: {
      type: String,
      trim: true,
      validate: {
        validator: function(this: any) {
          const format = this.format;
          if (format === 'virtual') {
            return this.zipcode === null || this.zipcode === undefined;
          }
          return !!this.zipcode;
        },
        message: 'Zipcode is required for in-person events, and must be null for virtual events'
      }
    },
    streetAddress: {
      type: String,
      trim: true,
      validate: {
        validator: function(this: any) {
          const format = this.format;
          if (format === 'virtual') {
            return this.streetAddress === null || this.streetAddress === undefined;
          }
          return !!this.streetAddress;
        },
        message: 'Street address is required for in-person events, and must be null for virtual events'
      }
    },

    // Tickets & Pricing (optional for free events)
    tickets: {
      type: [{
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
    validate: {
      validator: function(this: any) {
        const pricingType = this.pricingType;
        
        if (pricingType === 'free') {
          // Tickets should be null/empty for free events
          return !this.tickets || this.tickets.length === 0;
        } else {
          // Tickets should have values for paid events
          return this.tickets && this.tickets.length > 0;
        }
      },
      message: 'Tickets are required for paid events and must be empty for free events'
    }
    },


    // Event Details
    images: [
      {
        type: String,
        required: true,
      },
    ],

    ageRestriction: {
      type: Number,
      min: 0,
      max: 100,
    },
    requirements: [{
      type: String,
    }],
    tags: [{
      type: String,
    }],
    dressCode: {
      type: String,
    },
    whatsIncluded: [{
      type: String,
      required: true,
      trim: true,
    }],
    childrenPolicy: {
      type: String,
      enum: ['allowed', 'notAllowed'],
      required: true,
    },
    petPolicy: {
      type: String,
      enum: ['allowed', 'notAllowed'],
      required: true,
    },
    smokingPolicy: {
      type: String,
      enum: ['allowed', 'notAllowed'],
      required: true,
    },
    accessibilityFeatures: [{
      type: String,
      required: true,
    }],
    status: {
      type: String,
      enum: ["draft", "active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Add schema-level validation
eventSchema.pre('validate', function(next) {
  // Validate virtual fields
  if (!validateVirtualFields.call(this)) {
    return next(new Error('Virtual fields validation failed. Virtual fields must have values for virtual events and be null for in-person events.'));
  }
  
  // Validate venue fields
  if (!validateVenueFields.call(this)) {
    return next(new Error('Venue fields validation failed. Venue fields must have values for in-person events and be null for virtual events.'));
  }
  
  // Validate tickets field
  if (!validateTicketsField.call(this)) {
    return next(new Error('Tickets validation failed. Tickets are required for paid events and must be empty for free events.'));
  }
  
  next();
});

// Add indexes for optimal query performance
// Primary query indexes
eventSchema.index({ status: 1, startDate: 1, endDate: 1 });
eventSchema.index({ vendor: 1, status: 1 });
eventSchema.index({ category: 1, eventType: 1, status: 1 });

// Location-based indexes
eventSchema.index({ country: 1, state: 1, city: 1, status: 1 });
eventSchema.index({ venueName: 1, status: 1 });

// Format and pricing indexes
eventSchema.index({ format: 1, status: 1 });
eventSchema.index({ pricingType: 1, status: 1 });

// Search and discovery indexes
eventSchema.index({ title: "text", description: "text", summary: "text" });
eventSchema.index({ tags: 1, status: 1 });

// Performance optimization indexes
eventSchema.index({ startDate: 1, status: 1 });

// Compound indexes for complex queries
eventSchema.index({ 
  status: 1, 
  format: 1, 
  pricingType: 1, 
  startDate: 1 
});
eventSchema.index({ vendor: 1, startDate: 1, endDate: 1 });

export const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);