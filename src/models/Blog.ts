import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  featuredImage?: string;
  author: string;
  tags?: string[];
  category?: mongoose.Types.ObjectId;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  summary: {
    type: String,
    trim: true,
  },
  featuredImage: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Create text index for better search performance
BlogSchema.index({ title: 'text', content: 'text', summary: 'text' });

// Add pre-save hook to set publishedAt date when published
BlogSchema.pre('save', function(next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
export default Blog;
