import mongoose, { Schema } from "mongoose";

export interface ISetting extends Document {
  key: string;
  value: any;
  type: "string" | "number" | "boolean" | "json" | "textarea" | "url" | "image";
  category: "hero" | "stats" | "quicklinks" | "footer" | "general" | "seo";
  label: string;
  placeholder?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      enum: ["string", "number", "boolean", "json", "textarea", "url", "image"],
      default: "string",
    },
    category: {
      type: String,
      enum: ["hero", "stats", "quicklinks", "footer", "general", "seo"],
      default: "general",
      index: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: String,
    description: String,
  },
  { timestamps: true },
);

// Index for faster queries by category
SettingSchema.index({ category: 1, key: 1 });

export default mongoose.models.Setting ||
  mongoose.model<ISetting>("Setting", SettingSchema);
