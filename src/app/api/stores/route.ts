import { NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import { Store } from '@/models/Store';
import Deal from '@/models/Deal';

export async function GET() {
  try {
    await connectDB();
    
    // Get all active stores
    const stores = await Store.find({ isActive: true }).sort({ featured: -1, name: 1 });
    
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
      data: storesWithDeals
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching stores' },
      { status: 500 }
    );
  }
}