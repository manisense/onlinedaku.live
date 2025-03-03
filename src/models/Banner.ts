import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  image: string;
  link: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a banner title'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide a banner image URL'],
    },
    link: {
      type: String,
      required: [true, 'Please provide a banner link'],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;