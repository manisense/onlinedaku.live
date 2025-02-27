import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  store: string;
  category: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  image?: string;
  link: string;
  couponCode?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema = new Schema<IDeal>(
  {
    title: {
      type: String,
      required: [true, 'Deal title is required'],
      trim: true,
      
    },
    description: {
      type: String,
      trim: true,
     
    },
    price: {
      type: Number,
      required: [true, 'Current price is required'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
    },
    store: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'other',
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
    },
    image: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Allow empty
          try {
            new URL(v);
            return true;
          } catch (e) {
            return false;
          }
        },
        message: props => `${props.value} is not a valid image URL`
      }
    },
    link: {
      type: String,
      required: [true, 'Product link is required'],
      trim: true,
      validate: {
        validator: function(v: string) {
          try {
            new URL(v);
            return true;
          } catch (e) {
            return false;
          }
        },
        message: props => `${props.value} is not a valid URL`
      }
    },
    couponCode: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

// Clean URLs before saving
DealSchema.pre('save', function(next) {
  if (this.image && this.image.startsWith('http:')) {
    this.image = this.image.replace('http:', 'https:');
  }
  if (this.link.startsWith('http:')) {
    this.link = this.link.replace('http:', 'https:');
  }
  next();
});

// Create index for faster searches
DealSchema.index({ title: 'text', description: 'text' });
DealSchema.index({ store: 1 });
DealSchema.index({ isActive: 1 });
DealSchema.index({ endDate: 1 });

const Deal = mongoose.models.Deal || mongoose.model<IDeal>('Deal', DealSchema);

export default Deal;