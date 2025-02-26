import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  title: string;
  description: string;
  store: string;
  discount: string;
  expiryDate: Date;
  category: string;
  terms: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  store: {
    type: String,
    required: true,
    trim: true
  },
  discount: {
    type: String,
    required: true,
    trim: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
    // Removed index: true to avoid duplicate
  },
  terms: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create a text index for search functionality
CouponSchema.index({ 
  title: 'text', 
  description: 'text',
  code: 'text',
  store: 'text'
});

// Only create the model if it doesn't already exist to avoid overwriting
export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
