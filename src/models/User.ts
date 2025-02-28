import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
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
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  preferences: {
    categories: [{
      type: String,
      enum: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Books', 'Other']
    }],
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      deals: {
        type: Boolean,
        default: true
      }
    }
  },
  savedDeals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal'
  }],
  lastLogin: {
    type: Date,
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
