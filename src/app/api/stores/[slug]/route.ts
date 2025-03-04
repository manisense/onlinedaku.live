import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import { Store } from '@/models/Store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const store = await Store.findOne({ slug: slug, isActive: true });

    if (!store) {
      return NextResponse.json(
        { success: false, message: 'Store not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Store retrieved successfully',
      data: store
    });
  } catch (error) {
    console.error('Error fetching store:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching store details' },
      { status: 500 }
    );
  }
}
