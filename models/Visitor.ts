import mongoose, { Schema, Model, models } from "mongoose";
import { IVisitor } from "@/types";

const VisitorSchema = new Schema<IVisitor>({
  ip: {
    type: String,
    required: true,
    trim: true,
  },
  page: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  userAgent: {
    type: String,
    trim: true,
  },
  referrer: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
});

// Create indexes for analytics queries
VisitorSchema.index({ timestamp: -1 });
VisitorSchema.index({ page: 1, timestamp: -1 });
VisitorSchema.index({ ip: 1, timestamp: -1 });

const Visitor: Model<IVisitor> =
  models.Visitor || mongoose.model<IVisitor>("Visitor", VisitorSchema);

export default Visitor;
