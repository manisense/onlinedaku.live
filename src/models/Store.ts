import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website: string;
  isActive: boolean;
  categories: string[];
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
  },
  {
    timestamps: true,
  }
);

export const Store = mongoose.models.Store || mongoose.model<IStore>('Store', storeSchema);