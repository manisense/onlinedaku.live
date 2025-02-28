import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  permissions: {
    type: [String],
    default: ['manage_deals', 'view_analytics'], // Default permissions for regular admin
    enum: [
      'manage_deals',
      'manage_users',
      'manage_admins',
      'view_analytics',
      'manage_settings'
    ]
  }
}, {
  timestamps: true
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

AdminSchema.methods.getPermissions = function(): string[] {
  if (this.role === 'super_admin') {
    return [
      'manage_deals',
      'manage_users',
      'manage_admins',
      'view_analytics',
      'manage_settings'
    ];
  }
  return this.permissions || [];
};

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);