import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import DealAnalytics from '@/models/DealAnalytics';

interface DailyStat {
  date: Date;
  views: number;
  clicks: number;
  conversions: number;
}

export const maxDuration = 300;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { type } = await request.json();

    if (!['view', 'click', 'conversion'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid tracking type' },
        { status: 400 }
      );
    }

    await dbConnect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create analytics document
    let analytics = await DealAnalytics.findOne({ dealId: id });
    
    if (!analytics) {
      analytics = new DealAnalytics({
        dealId: id,
        views: 0,
        clicks: 0,
        conversions: 0,
        dailyStats: []
      });
    }

    // Update overall stats
    analytics[type === 'view' ? 'views' : type === 'click' ? 'clicks' : 'conversions']++;

    // Update or create daily stats
    const dailyStat = analytics.dailyStats.find(
      (stat: DailyStat) => new Date(stat.date).getTime() === today.getTime()
    );

    if (dailyStat) {
      dailyStat[type === 'view' ? 'views' : type === 'click' ? 'clicks' : 'conversions']++;
    } else {
      analytics.dailyStats.push({
        date: today,
        views: type === 'view' ? 1 : 0,
        clicks: type === 'click' ? 1 : 0,
        conversions: type === 'conversion' ? 1 : 0
      });
    }

    analytics.lastUpdated = new Date();
    await analytics.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
} 