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
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, // Don't return password in queries by default
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
  permissions: [{
    type: String,
    enum: [
      'manage_deals',
      'manage_coupons',
      'manage_users',
      'manage_admins',
      'view_analytics',
      'manage_settings'
    ]
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
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
  console.log('comparePassword called');
  console.log('Stored password exists:', !!this.password);
  console.log('Entered password length:', enteredPassword?.length);
  console.log('Stored password length:', this.password?.length);
  
  const result = await bcrypt.compare(enteredPassword, this.password);
  console.log('Password comparison result:', result);
  return result;
};

// Method to get admin's full permissions
AdminSchema.methods.getPermissions = function(): string[] {
  if (this.role === 'super_admin') {
    return [
      'manage_deals',
      'manage_coupons',
      'manage_users',
      'manage_admins',
      'view_analytics',
      'manage_settings'
    ];
  }
  return this.permissions;
};

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema); 