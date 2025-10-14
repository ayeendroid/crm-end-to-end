import mongoose, { Document, Schema } from "mongoose";

export interface IActivity extends Document {
  type: "call" | "email" | "meeting" | "task" | "note" | "demo" | "proposal";
  subject: string;
  description?: string;
  relatedTo: {
    type: "customer" | "lead" | "deal";
    id: mongoose.Types.ObjectId;
  };
  assignedTo: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  priority: "low" | "medium" | "high" | "urgent";
  scheduledDate?: Date;
  completedDate?: Date;
  duration?: number; // in minutes
  location?: string;
  attendees: mongoose.Types.ObjectId[];
  outcome?: string;
  nextAction?: string;
  nextActionDate?: Date;
  attachments: {
    filename: string;
    url: string;
    size: number;
  }[];
  tags: string[];
  customFields: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      enum: ["call", "email", "meeting", "task", "note", "demo", "proposal"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    relatedTo: {
      type: {
        type: String,
        enum: ["customer", "lead", "deal"],
        required: true,
      },
      id: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "relatedTo.type",
      },
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    scheduledDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    duration: {
      type: Number,
      min: 0,
    },
    location: {
      type: String,
      trim: true,
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    outcome: {
      type: String,
      trim: true,
    },
    nextAction: {
      type: String,
      trim: true,
    },
    nextActionDate: {
      type: Date,
    },
    attachments: [
      {
        filename: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    customFields: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

ActivitySchema.index({ assignedTo: 1, status: 1 });
ActivitySchema.index({ "relatedTo.type": 1, "relatedTo.id": 1 });
ActivitySchema.index({ scheduledDate: 1 });
ActivitySchema.index({ priority: 1, status: 1 });
ActivitySchema.index({ createdAt: -1 });

export const Activity = mongoose.model<IActivity>("Activity", ActivitySchema);
