import mongoose, { type Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  role: "explorer" | "vendor" | "team_member" | "super_admin" | "sub_admin";
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  email: string;
  username: string;
  password: string;
  avatar?: string;
  country?: string;
  state?: string;
  city?: string;
  streetAddress?: string;
  isActive: boolean;
  vendorAccountPreference: "";
  organizations: mongoose.Types.ObjectId[];
  permissions?: string[];
  onboarding?: boolean;
  interests?: string[];
  comparePassword(password: string): Promise<boolean>;
  isNewsletterSubscribed?: boolean;
  lastLogin: string | null;
  // Bank details for payments (optional during registration, required during onboarding)
  bankDetails?: {
    accountNumber?: string;
    bankCode?: string;
    accountName?: string;
    bankName?: string;
  };
  // Custom commission rate for vendors (optional, used for partnerships)
  // If null, uses platform's default rate based on vendor's account preference
  commissionRate?: number | null;
  // Paystack subaccount fields (optional during registration, required during onboarding)
  paystackSubaccount?: {
    subaccountId?: string;
    status: "pending" | "active" | "inactive" | "suspended";
    settlementBank?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastVerifiedAt?: Date;
  };
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    role: {
      type: String,
      enum: ["explorer", "vendor", "team_member", "super_admin", "sub_admin"],
      required: [true, "Role is required"],
    },
    firstName: {
      type: String,
      required: function () {
        return ["explorer", "team_member", "super_admin", "sub_admin"].includes(
          this.role
        );
      },
      trim: true,
    },
    lastName: {
      type: String,
      required: function () {
        return ["explorer", "team_member", "super_admin", "sub_admin"].includes(
          this.role
        );
      },
      trim: true,
    },
    businessName: {
      type: String,
      required: function () {
        return this.role === "vendor";
      },
      trim: true,
    },
    phone: {
      type: String,
      required: function () {
        return ["vendor", "team_member"].includes(this.role);
      },
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (value: string) {
          if (!value) return true; // Allow empty string
          return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
            value
          );
        },
        message: "Invalid URL format for avatar",
      },
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    streetAddress: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    vendorAccountPreference: {
      type: String,
      required: function () {
        return this.role === "vendor";
      },
    },
    organizations: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Organization",
      default: [],
    },
    permissions: {
      type: [String],
      default: [],
    },
    onboarding: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (val: boolean) {
          return ["vendor", "team_member"].includes(this.role) || val === false;
        },
        message: "Only vendors and team members can have onboarding status",
      },
    },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator: function (val: string[]) {
          return this.role === "explorer" || val.length === 0;
        },
        message: "Interests are applicable only to explorers",
      },
    },
    isNewsletterSubscribed: {
      type: Boolean,
      default: false,
    },
    lastLogin: { type: String, default: null },
    // Bank details for payments
    bankDetails: {
      accountNumber: {
        type: String,
        required: function () {
          return this.role === "vendor" && this.onboarding === true;
        },
      },
      bankCode: {
        type: String,
        required: function () {
          return this.role === "vendor" && this.onboarding === true;
        },
      },
      accountName: {
        type: String,
        required: function () {
          return this.role === "vendor" && this.onboarding === true;
        },
      },
      bankName: {
        type: String,
      },
    },
    // Custom commission rate for vendors (optional, used for partnerships)
    // If null, uses platform's default rate based on vendor's account preference
    commissionRate: {
      type: Number,
      default: null, // Default null - uses platform's configuration rate
      min: 0,
      max: 100,
    },
    // Paystack subaccount fields
    paystackSubaccount: {
      subaccountId: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values
        required: function () {
          return this.role === "vendor" && this.onboarding === true;
        },
      },
      status: {
        type: String,
        enum: ["pending", "active", "inactive", "suspended"],
        default: "pending",
      },
      settlementBank: {
        type: String,
        required: function () {
          return this.role === "vendor" && this.onboarding === true;
        },
      },
      lastVerifiedAt: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;