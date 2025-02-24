import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';
import DealAnalytics from '@/models/DealAnalytics';
import { verifyToken } from '@/utils/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get all deals with their analytics
    const deals = await Deal.aggregate([
      {
        $lookup: {
          from: 'dealanalytics',
          localField: '_id',
          foreignField: 'dealId',
          as: 'analytics'
        }
      },
      {
        $unwind: {
          path: '$analytics',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          title: 1,
          store: 1,
          category: 1,
          discountType: 1,
          discountValue: 1,
          startDate: 1,
          endDate: 1,
          isActive: 1,
          couponCode: 1,
          views: '$analytics.views',
          clicks: '$analytics.clicks',
          conversions: '$analytics.conversions',
          conversionRate: {
            $cond: [
              { $gt: ['$analytics.clicks', 0] },
              { $multiply: [{ $divide: ['$analytics.conversions', '$analytics.clicks'] }, 100] },
              0
            ]
          }
        }
      }
    ]);

    // Format dates and numbers
    const formattedDeals = deals.map(deal => ({
      ...deal,
      startDate: new Date(deal.startDate).toLocaleDateString(),
      endDate: new Date(deal.endDate).toLocaleDateString(),
      conversionRate: deal.conversionRate?.toFixed(2) + '%' || '0%',
      views: deal.views || 0,
      clicks: deal.clicks || 0,
      conversions: deal.conversions || 0,
    }));

    return NextResponse.json({ deals: formattedDeals });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export deals' },
      { status: 500 }
    );
  }
} 