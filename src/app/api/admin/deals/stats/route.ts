import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';
import { verifyToken } from '@/utils/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();

    const [totalDeals, activeDeals, expiredDeals, upcomingDeals] = await Promise.all([
      Deal.countDocuments(),
      Deal.countDocuments({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gt: now }
      }),
      Deal.countDocuments({
        endDate: { $lte: now }
      }),
      Deal.countDocuments({
        startDate: { $gt: now }
      })
    ]);

    return NextResponse.json({
      stats: {
        totalDeals,
        activeDeals,
        expiredDeals,
        upcomingDeals
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
} 