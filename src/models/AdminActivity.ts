import mongoose from 'mongoose';

const AdminActivitySchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE']
  },
  ip: String,
  userAgent: String,
  additionalInfo: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
  strict: false
});

export default mongoose.models.AdminActivity || mongoose.model('AdminActivity', AdminActivitySchema);