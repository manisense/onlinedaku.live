import { Document } from 'mongoose';

export interface IBlog extends Document {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  isPublished: boolean;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogFormData = Omit<IBlog, '_id' | 'author' | 'createdAt' | 'updatedAt'>;
