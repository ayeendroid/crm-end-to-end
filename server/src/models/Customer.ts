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

  // ISP-Specific Fields
  ispData?: {
    plan?: {
      type?: "Fiber" | "Broadband" | "Wireless";
      speed?: string;
      price?: number;
      billingCycle?: "Monthly" | "Quarterly" | "Annual";
      ottApps?: string[];
      liveChannels?: number;
    };
    usage?: {
      dataConsumed?: number;
      averageSpeed?: number;
      uptime?: number;
      mostUsedOTT?: string[];
      peakUsageHours?: string[];
    };
    customerSince?: Date;
    lifetimeValue?: number;
    churnRisk?: "Low" | "Medium" | "High";
    npsScore?: number;
    tickets?: number;
    lastTicketDate?: Date;
    satisfaction?: 1 | 2 | 3 | 4 | 5;
    referredBy?: string;
    nextBillingDate?: Date;
    outstandingAmount?: number;
  };

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
    // ISP-Specific Fields
    ispData: {
      plan: {
        type: {
          type: String,
          enum: ["Fiber", "Broadband", "Wireless"],
        },
        speed: String,
        price: Number,
        billingCycle: {
          type: String,
          enum: ["Monthly", "Quarterly", "Annual"],
        },
        ottApps: [String],
        liveChannels: Number,
      },
      usage: {
        dataConsumed: Number,
        averageSpeed: Number,
        uptime: Number,
        mostUsedOTT: [String],
        peakUsageHours: [String],
      },
      customerSince: Date,
      lifetimeValue: Number,
      churnRisk: {
        type: String,
        enum: ["Low", "Medium", "High"],
      },
      npsScore: {
        type: Number,
        min: -100,
        max: 100,
      },
      tickets: {
        type: Number,
        default: 0,
      },
      lastTicketDate: Date,
      satisfaction: {
        type: Number,
        min: 1,
        max: 5,
      },
      referredBy: String,
      nextBillingDate: Date,
      outstandingAmount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
// TEXT INDEX for multi-word search with weighted relevance
CustomerSchema.index(
  {
    firstName: "text",
    lastName: "text",
    email: "text",
    company: "text",
  },
  {
    weights: {
      firstName: 10,
      lastName: 10,
      email: 5,
      company: 3,
    },
    name: "customer_text_search",
  }
);

// Individual field indexes for single-word prefix matching
CustomerSchema.index({ firstName: 1 });
CustomerSchema.index({ lastName: 1 });
CustomerSchema.index({ email: 1 }, { unique: true, sparse: true }); // Unique but allows nulls
CustomerSchema.index({ company: 1 });

// Compound indexes following ESR (Equality-Sort-Range) rule
CustomerSchema.index({ status: 1, createdAt: -1 });
CustomerSchema.index({ source: 1, createdAt: -1 });
CustomerSchema.index({ assignedTo: 1, status: 1, createdAt: -1 });
CustomerSchema.index({ status: 1, source: 1, createdAt: -1 });

// Other useful indexes
CustomerSchema.index({ tags: 1 });
CustomerSchema.index({ createdAt: -1 });

// ISP-specific indexes for analytics
CustomerSchema.index({ "ispData.churnRisk": 1 });
CustomerSchema.index({ "ispData.plan.type": 1 });
CustomerSchema.index({ "ispData.nextBillingDate": 1 });
CustomerSchema.index({ "ispData.npsScore": 1 });
CustomerSchema.index({ "ispData.lifetimeValue": -1 }); // Descending for top customers

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
