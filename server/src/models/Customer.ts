import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  website?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  tags: string[];
  source:
    | "website"
    | "referral"
    | "social"
    | "email"
    | "phone"
    | "event"
    | "other";
  status: "active" | "inactive" | "prospect";
  assignedTo: mongoose.Types.ObjectId;
  lastContactDate?: Date;
  nextFollowUp?: Date;
  totalValue: number;
  notes: string;
  customFields: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
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
    website: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    source: {
      type: String,
      enum: [
        "website",
        "referral",
        "social",
        "email",
        "phone",
        "event",
        "other",
      ],
      default: "website",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "prospect"],
      default: "prospect",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastContactDate: {
      type: Date,
    },
    nextFollowUp: {
      type: Date,
    },
    totalValue: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
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

CustomerSchema.index({ email: 1 });
CustomerSchema.index({ assignedTo: 1, status: 1 });
CustomerSchema.index({ company: 1 });
CustomerSchema.index({ tags: 1 });
CustomerSchema.index({ createdAt: -1 });

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
