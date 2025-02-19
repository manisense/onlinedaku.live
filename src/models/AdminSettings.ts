import mongoose from 'mongoose';

const AdminSettingsSchema = new mongoose.Schema({
  settingKey: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  settingValue: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'site',
      'deals',
      'coupons',
      'notifications',
      'security',
      'analytics'
    ]
  },
  description: {
    type: String,
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
AdminSettingsSchema.index({ category: 1, settingKey: 1 });

export default mongoose.models.AdminSettings || mongoose.model('AdminSettings', AdminSettingsSchema); 