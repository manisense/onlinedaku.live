import mongoose from 'mongoose';
const { Schema } = mongoose;

const DealSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide the current price']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Please provide the original price']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: [true, 'Please provide the discount value']
  },
  store: {
    type: String,
    required: [true, 'Please provide the store name']
  },
  link: {
    type: String,
    required: [true, 'Please provide a link to the deal']
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    // Accept either ObjectId reference or string
    type: Schema.Types.Mixed,
    required: [true, 'Please specify a category'],
    ref: 'Category' // This will be used when it's an ObjectId
  },
  tags: {
    type: [String],
    default: []
  },
  couponCode: {
    type: String
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes
DealSchema.index({ store: 1 });
DealSchema.index({ category: 1 });
DealSchema.index({ startDate: 1, endDate: 1 });
DealSchema.index({ isActive: 1 });
DealSchema.index({ createdAt: -1 });

export default mongoose.models.Deal || mongoose.model('Deal', DealSchema);
