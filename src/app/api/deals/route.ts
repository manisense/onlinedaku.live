import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const sortBy = searchParams.get('sortBy') || 'newest';
    
    const now = new Date();
    
    const query = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gt: now }
    } as const;

    let sort = {};
    switch (sortBy) {
      case 'discount':
        sort = { discountValue: -1 };
        break;
      case 'price':
        sort = { discountValue: 1 };
        break;
      default: // newest
        sort = { createdAt: -1 };
    }

    const deals = await Deal.find(query)
      .sort(sort)
      .lean();

    return NextResponse.json({ 
      success: true, 
      deals
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}