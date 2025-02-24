import mongoose from 'mongoose';

const DealAnalyticsSchema = new mongoose.Schema({
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  conversions: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  dailyStats: [{
    date: Date,
    views: Number,
    clicks: Number,
    conversions: Number,
  }],
}, {
  timestamps: true,
});

// Add indexes for better query performance
DealAnalyticsSchema.index({ dealId: 1 });
DealAnalyticsSchema.index({ 'dailyStats.date': 1 });

export default mongoose.models.DealAnalytics || mongoose.model('DealAnalytics', DealAnalyticsSchema); 