import mongoose, { Schema, Model, models } from "mongoose";
import { ICase } from "@/types";

const CaseSchema = new Schema<ICase>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
    },
    motherName: {
      type: String,
      required: [true, "Mother's name is required"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    documentNumber: {
      type: String,
      required: [true, "Document number is required"],
      trim: true,
      uppercase: true,
    },
    documentIssueDate: {
      type: Date,
      required: [true, "Document issue date is required"],
    },
    documentExpiryDate: {
      type: Date,
      required: [true, "Document expiry date is required"],
    },
    passportNumber: {
      type: String,
      required: [true, "Passport number is required"],
      trim: true,
      uppercase: true,
    },
    passportIssueDate: {
      type: Date,
      required: [true, "Passport issue date is required"],
    },
    passportExpiryDate: {
      type: Date,
      required: [true, "Passport expiry date is required"],
    },
    sex: {
      type: String,
      required: [true, "Sex is required"],
      enum: ["Male", "Female", "Other"],
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
      trim: true,
    },
    uciNumber: {
      type: String,
      required: [true, "UCI/IUC number is required"],
      trim: true,
      uppercase: true,
    },
    caseType: {
      type: String,
      required: [true, "Case type is required"],
      trim: true,
    },
    employer: {
      type: String,
      trim: true,
    },
    employerLocation: {
      type: String,
      trim: true,
    },
    displayStatus: {
      type: Boolean,
      default: true,
    },
    note: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Pending", "Approved", "Rejected", "In Progress"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

// Create compound unique index for document and passport number
CaseSchema.index({ documentNumber: 1, passportNumber: 1 }, { unique: true });

// Create individual indexes for fast searches
CaseSchema.index({ documentNumber: 1 });
CaseSchema.index({ passportNumber: 1 });
CaseSchema.index({ uciNumber: 1 });
CaseSchema.index({ status: 1 });
CaseSchema.index({ displayStatus: 1 });

const Case: Model<ICase> =
  models.Case || mongoose.model<ICase>("Case", CaseSchema);

export default Case;
