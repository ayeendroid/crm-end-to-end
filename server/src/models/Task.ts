import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  relatedTo?: {
    type: "customer" | "lead" | "deal" | "activity";
    id: mongoose.Types.ObjectId;
  };
  assignedTo: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  status: "todo" | "in-progress" | "blocked" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  completedDate?: Date;
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags: string[];
  checklist: {
    item: string;
    completed: boolean;
  }[];
  reminders: Date[];
  isRecurring: boolean;
  recurringPattern?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    endDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
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
        enum: ["customer", "lead", "deal", "activity"],
      },
      id: {
        type: Schema.Types.ObjectId,
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
      enum: ["todo", "in-progress", "blocked", "completed", "cancelled"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    estimatedMinutes: {
      type: Number,
      min: 0,
    },
    actualMinutes: {
      type: Number,
      min: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    checklist: [
      {
        item: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    reminders: [
      {
        type: Date,
      },
    ],
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
      },
      interval: {
        type: Number,
        min: 1,
      },
      endDate: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ dueDate: 1, status: 1 });
TaskSchema.index({ priority: 1, status: 1 });
TaskSchema.index({ "relatedTo.type": 1, "relatedTo.id": 1 });
TaskSchema.index({ createdAt: -1 });

// Auto-update completedDate when status changes to completed
TaskSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "completed" &&
    !this.completedDate
  ) {
    this.completedDate = new Date();
  }
  next();
});

export const Task = mongoose.model<ITask>("Task", TaskSchema);
