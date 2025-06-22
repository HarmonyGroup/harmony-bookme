import mongoose, { type Document } from "mongoose";

interface IOrganization extends Document {
  name: string;
  slug: string;
  vendor: mongoose.Types.ObjectId;
  teamMembers: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new mongoose.Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      minlength: [2, "Organization name must be at least 2 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor ID is required"],
    },
    teamMembers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

const Organization =
  mongoose.models.Organization ||
  mongoose.model<IOrganization>("Organization", OrganizationSchema);

export default Organization;