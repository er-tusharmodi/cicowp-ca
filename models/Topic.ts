import mongoose, { Schema, Model, models } from "mongoose";

export interface ITopic {
  _id?: string;
  title: string;
  description: string;
  href: string;
  isActive: boolean;
  order: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    title: {
      type: String,
      required: [true, "Topic title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    href: {
      type: String,
      required: [true, "Link URL is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
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

TopicSchema.index({ order: 1, createdAt: 1 });
TopicSchema.index({ isActive: 1 });

const Topic: Model<ITopic> =
  models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);

export default Topic;
