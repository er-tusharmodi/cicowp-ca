import mongoose, { Schema, Model, models } from "mongoose";

export interface IPage {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  metaDescription?: string;
  isPublished: boolean;
  showInNav: boolean;
  navOrder: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PageSchema = new Schema<IPage>(
  {
    title: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Page slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    content: {
      type: String,
      required: [true, "Page content is required"],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    showInNav: {
      type: Boolean,
      default: false,
    },
    navOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

PageSchema.index({ slug: 1 });
PageSchema.index({ isPublished: 1, showInNav: 1 });

const Page: Model<IPage> =
  models.Page || mongoose.model<IPage>("Page", PageSchema);

export default Page;
