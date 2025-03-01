import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const excludeId = searchParams.get('excludeId');
    const limit = parseInt(searchParams.get('limit') || '4');

    const now = new Date();
    
    // Base query for active deals
    const query = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gt: now }
    } as const;

    // If excludeId is provided, add it to the query
    if (excludeId) {
      Object.assign(query, { _id: { $ne: excludeId } });
    }

    // Get random deals
    const deals = await Deal.aggregate([
      { $match: query },
      { $sample: { size: limit } }
    ]);

    return NextResponse.json({ 
      success: true, 
      deals
    });
  } catch (error) {
    console.error('Error fetching recommended deals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommended deals' },
      { status: 500 }
    );
  }
}