import mongoose, { Schema, Model, models } from "mongoose";
import { IAdmin } from "@/types";

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["admin", "super-admin"],
      default: "admin",
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Create index for email
AdminSchema.index({ email: 1 });

const Admin: Model<IAdmin> =
  models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
