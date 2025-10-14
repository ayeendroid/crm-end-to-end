import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  source:
    | "website"
    | "referral"
    | "social"
    | "email"
    | "phone"
    | "event"
    | "advertisement"
    | "other";
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "closed-won"
    | "closed-lost";
  score: number; // Lead scoring 0-100
  assignedTo: mongoose.Types.ObjectId;
  estimatedValue: number;
  expectedCloseDate?: Date;
  lastContactDate?: Date;
  nextFollowUp?: Date;
  tags: string[];
  notes: string;
  activities: mongoose.Types.ObjectId[];
  convertedTo?: mongoose.Types.ObjectId; // Reference to Customer if converted
  conversionDate?: Date;
  customFields: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: [
        "website",
        "referral",
        "social",
        "email",
        "phone",
        "event",
        "advertisement",
        "other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "proposal",
        "negotiation",
        "closed-won",
        "closed-lost",
      ],
      default: "new",
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    estimatedValue: {
      type: Number,
      default: 0,
    },
    expectedCloseDate: {
      type: Date,
    },
    lastContactDate: {
      type: Date,
    },
    nextFollowUp: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    activities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    convertedTo: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    conversionDate: {
      type: Date,
    },
    customFields: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

LeadSchema.index({ email: 1 });
LeadSchema.index({ assignedTo: 1, status: 1 });
LeadSchema.index({ score: -1 });
LeadSchema.index({ expectedCloseDate: 1 });
LeadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model<ILead>("Lead", LeadSchema);
