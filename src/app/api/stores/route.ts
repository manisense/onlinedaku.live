import { NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import { Store } from '@/models/Store';
import Deal from '@/models/Deal';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Get pagination parameters from query
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalStores = await Store.countDocuments({ isActive: true });
    
    // Get stores with pagination
    const stores = await Store.find({ isActive: true })
      .sort({ featured: -1, name: 1 })
      .skip(skip)
      .limit(limit);
    
    // For each store, count active deals
    const storesWithDeals = await Promise.all(
      stores.map(async (store) => {
        const activeDeals = await Deal.countDocuments({ 
          store: store.slug, 
          isActive: true 
        });
        
        return {
          ...store.toObject(),
          activeDeals
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Stores retrieved successfully',
      data: storesWithDeals,
      pagination: {
        total: totalStores,
        page,
        limit,
        totalPages: Math.ceil(totalStores / limit),
        hasMore: page * limit < totalStores
      }
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching stores' },
      { status: 500 }
    );
  }
}