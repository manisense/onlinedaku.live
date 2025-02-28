import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    default: 'Online Daku'
  },
  siteDescription: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    telegram: String
  },
  dealSettings: {
    defaultDealDuration: {
      type: Number,
      default: 30
    },
    maximumDiscountValue: {
      type: Number,
      default: 100
    },
    minimumDiscountValue: {
      type: Number,
      default: 0
    }
  },
  seoSettings: {
    defaultTitle: String,
    defaultDescription: String,
    defaultKeywords: String
  }
}, {
  timestamps: true
});

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
