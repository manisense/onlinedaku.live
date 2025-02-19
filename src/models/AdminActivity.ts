import mongoose from 'mongoose';

const AdminActivitySchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'create_deal',
      'update_deal',
      'delete_deal',
      'create_coupon',
      'update_coupon',
      'delete_coupon',
      'update_settings',
      'manage_user',
      'manage_admin'
    ]
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
AdminActivitySchema.index({ admin: 1, createdAt: -1 });
AdminActivitySchema.index({ action: 1, createdAt: -1 });

export default mongoose.models.AdminActivity || mongoose.model('AdminActivity', AdminActivitySchema); 