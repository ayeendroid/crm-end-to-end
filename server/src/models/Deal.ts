import mongoose, { Document, Schema } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  description?: string;
  customer: mongoose.Types.ObjectId;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number; // 0-100
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  assignedTo: mongoose.Types.ObjectId;
  tags: string[];
  products: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    discount: number;
  }[];
  activities: mongoose.Types.ObjectId[];
  notes: string;
  lostReason?: string;
  customFields: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema = new Schema<IDeal>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  stage: {
    type: String,
    enum: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
    default: 'prospecting'
  },
  probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 10
  },
  expectedCloseDate: {
    type: Date,
    required: true
  },
  actualCloseDate: {
    type: Date
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }],
  activities: [{
    type: Schema.Types.ObjectId,
    ref: 'Activity'
  }],
  notes: {
    type: String,
    trim: true
  },
  lostReason: {
    type: String,
    trim: true
  },
  customFields: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

DealSchema.index({ customer: 1 });
DealSchema.index({ assignedTo: 1, stage: 1 });
DealSchema.index({ expectedCloseDate: 1 });
DealSchema.index({ value: -1 });
DealSchema.index({ createdAt: -1 });

export const Deal = mongoose.model<IDeal>('Deal', DealSchema);