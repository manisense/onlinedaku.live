import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import Deal from '@/models/Deal';
import { Store } from '@/models/Store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    // Find the store first to make sure it exists
    const store = await Store.findOne({ slug: slug, isActive: true });

    if (!store) {
      return NextResponse.json(
        { success: false, message: 'Store not found' },
        { status: 404 }
      );
    }

    // Get all active deals that have store field matching the store's slug
    const deals = await Deal.find({ 
      store: store.slug, // Use slug instead of ID
      isActive: true 
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: 'Deals retrieved successfully',
      data: deals
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching store deals' },
      { status: 500 }
    );
  }
}
