import mongoose from 'mongoose';

const DealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  store: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required'],
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: 0,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  couponCode: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  }
}, {
  timestamps: true,
});

// Add indexes for better query performance
DealSchema.index({ store: 1 });
DealSchema.index({ category: 1 });
DealSchema.index({ isActive: 1 });
DealSchema.index({ endDate: 1 });

// Add these indexes for better performance
DealSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
DealSchema.index({ createdAt: -1 });

export default mongoose.models.Deal || mongoose.model('Deal', DealSchema);