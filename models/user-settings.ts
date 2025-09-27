// models/user-settings.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUserSettings extends Document {
  user: mongoose.Types.ObjectId;
  role: string;
  allowMarketingEmails: boolean;
  subscribeToNewsletter: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["explorer", "vendor", "super_admin", "sub_admin"],
    },
    allowMarketingEmails: {
      type: Boolean,
      required: true,
      default: false,
    },
    subscribeToNewsletter: {
      type: Boolean,
      required: true,
      default: false,
    },
    twoFactorAuthentication: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.UserSettings ||
  mongoose.model<IUserSettings>("UserSettings", UserSettingsSchema);