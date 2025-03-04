import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  _id: string;
  offerId: string;
  title: string;
  description: string;
  code: string;
  featured: boolean;
  url: string;
  affiliateLink: string;
  imageUrl: string;
  brandLogo: string;
  type: string;
  store: string;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  rating: number;
  label: string;
  isActive: boolean;
  storeSlug: string;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    offerId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    code: { type: String },
    featured: { type: Boolean, default: false },
    url: { type: String },
    affiliateLink: { type: String },
    imageUrl: { type: String },
    brandLogo: { type: String },
    type: { type: String },
    store: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, default: 'active' },
    rating: { type: Number, default: 5 },
    label: { type: String },
    isActive: { type: Boolean, default: true },
    storeSlug: { type: String }
  },
  { 
    timestamps: true,
    strict: false 
  }
);

// Create indexes for frequently queried fields
couponSchema.index({ store: 1 });
couponSchema.index({ storeSlug: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ endDate: 1 });
couponSchema.index({ categories: 1 });

// Use 'Coupon' as the model name to match what's used in the API
const CouponModel = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', couponSchema);

export { CouponModel };
export default CouponModel;
