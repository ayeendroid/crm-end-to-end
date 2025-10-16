import mongoose, { Document, Schema } from 'mongoose';

// Email status enum
export enum EmailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  BOUNCED = 'bounced',
  OPENED = 'opened',
  CLICKED = 'clicked',
}

// Email type enum
export enum EmailType {
  WELCOME = 'welcome',
  FOLLOWUP = 'followup',
  INVOICE = 'invoice',
  CAMPAIGN = 'campaign',
  CUSTOM = 'custom',
}

// Email interface
export interface IEmail extends Document {
  to: string[];
  from: string;
  subject: string;
  html: string;
  text?: string;
  type: EmailType;
  status: EmailStatus;
  customerId?: mongoose.Types.ObjectId;
  leadId?: mongoose.Types.ObjectId;
  dealId?: mongoose.Types.ObjectId;
  sentBy: mongoose.Types.ObjectId;
  sentAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  errorMessage?: string;
  attachments?: Array<{
    filename: string;
    path: string;
    size: number;
  }>;
  metadata?: {
    templateId?: string;
    campaignId?: string;
    tags?: string[];
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Email schema
const EmailSchema = new Schema<IEmail>(
  {
    to: {
      type: [String],
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    html: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    type: {
      type: String,
      enum: Object.values(EmailType),
      default: EmailType.CUSTOM,
    },
    status: {
      type: String,
      enum: Object.values(EmailStatus),
      default: EmailStatus.PENDING,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
    },
    dealId: {
      type: Schema.Types.ObjectId,
      ref: 'Deal',
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sentAt: {
      type: Date,
    },
    openedAt: {
      type: Date,
    },
    clickedAt: {
      type: Date,
    },
    errorMessage: {
      type: String,
    },
    attachments: [
      {
        filename: String,
        path: String,
        size: Number,
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
EmailSchema.index({ customerId: 1, createdAt: -1 });
EmailSchema.index({ leadId: 1, createdAt: -1 });
EmailSchema.index({ dealId: 1, createdAt: -1 });
EmailSchema.index({ sentBy: 1, createdAt: -1 });
EmailSchema.index({ status: 1, createdAt: -1 });
EmailSchema.index({ type: 1, createdAt: -1 });

// Export model
export const Email = mongoose.model<IEmail>('Email', EmailSchema);
