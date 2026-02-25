import mongoose, { Schema, Model, models } from "mongoose";
import { IContactSubmission } from "@/types";

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create index for timestamp
ContactSubmissionSchema.index({ createdAt: -1 });

const ContactSubmission: Model<IContactSubmission> =
  models.ContactSubmission ||
  mongoose.model<IContactSubmission>(
    "ContactSubmission",
    ContactSubmissionSchema,
  );

export default ContactSubmission;
