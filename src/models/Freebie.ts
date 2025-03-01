import mongoose, { Schema, Document } from 'mongoose';

export interface IFreebie extends Document {
  title: string;
  description: string;
  store: string;
  category: string;
  image: string;
  link: string;
  termsAndConditions: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FreebieSchema = new Schema<IFreebie>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    store: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, required: true },
    termsAndConditions: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Freebie || mongoose.model<IFreebie>('Freebie', FreebieSchema);