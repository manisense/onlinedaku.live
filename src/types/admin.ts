import { Document } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  lastLogin: Date;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
  getPermissions(): string[];
}

export interface IAdminActivity extends Document {
  admin: IAdmin['_id'];
  action: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface IAdminSettings extends Document {
  settingKey: string;
  settingValue: string;
  category: 'site' | 'deals' | 'coupons' | 'notifications' | 'security' | 'analytics';
  description: string;
  lastUpdatedBy: IAdmin['_id'];
  isPublic: boolean;
  updatedAt: Date;
}

export type AdminPermission = 
  | 'manage_deals'
  | 'manage_coupons'
  | 'manage_users'
  | 'manage_admins'
  | 'view_analytics'
  | 'manage_settings'; 