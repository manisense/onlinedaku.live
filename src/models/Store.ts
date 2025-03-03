import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website: string;
  isActive: boolean;
  categories: string[];
  rating: number;
  totalReviews: number;
  address?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  featuredImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    address: {
      type: String,
      trim: true
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String
    },
    featuredImage: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

export const Store = mongoose.models.Store || mongoose.model<IStore>('Store', storeSchema);