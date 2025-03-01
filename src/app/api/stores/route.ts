import { NextRequest, NextResponse } from 'next/server';
import dbConnect  from '@/utils/dbConnect';
import { Store } from '@/models/Store';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    // Fetch stores with pagination
    const stores = await Store.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('name slug description logo website categories');

    // Get total count for pagination
    const totalStores = await Store.countDocuments({ isActive: true });

    return NextResponse.json({
      success: true,
      data: stores,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalStores / limit),
        totalItems: totalStores,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}