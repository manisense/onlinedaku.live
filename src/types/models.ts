import { Document } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  store: string;
  expiryDate: Date;
  link: string;
  image: string;
  isVerified: boolean;
  createdBy?: string;
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  password?: string;
  name?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

declare global {
    // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
}