import mongoose, { Schema, Document } from 'mongoose';

export interface IFreebie extends Document {
  title: string;
  description: string;
  store: string;
  category: mongoose.Types.ObjectId | string; // Updated to support both ObjectId and string
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
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    store: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v: string) {
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
      required: true,
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
    termsAndConditions: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Create indexes for faster searches
FreebieSchema.index({ title: 'text', description: 'text' });
FreebieSchema.index({ store: 1 });
FreebieSchema.index({ category: 1 });
FreebieSchema.index({ isActive: 1 });
FreebieSchema.index({ endDate: 1 });

export default mongoose.models.Freebie || mongoose.model<IFreebie>('Freebie', FreebieSchema);