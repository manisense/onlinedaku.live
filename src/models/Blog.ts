import { Schema, model, models, Document, Types } from 'mongoose';
import { IUser } from '@/types/models';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  isPublished: boolean;
  author: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  coverImage: String,
  tags: [String],
  isPublished: { type: Boolean, default: false },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

export default models.Blog || model<IBlog>('Blog', blogSchema);
