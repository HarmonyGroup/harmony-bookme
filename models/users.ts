import mongoose, { type Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  role: "explorer" | "vendor" | "team_member" | "super_admin" | "sub_admin";
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
  email: string;
  password: string;
  avatar?: string;
  status: "pending" | "active" | "suspended";
  organizations: mongoose.Types.ObjectId[];
  permissions?: string[];
  onboarding?: boolean;
  interests?: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
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
    password: {
      type: String,
      required: function () {
        return this.status === "active";
      },
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
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
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
          return (
            ["vendor", "team_member"].includes(this.role) || val === false
          );
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
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;