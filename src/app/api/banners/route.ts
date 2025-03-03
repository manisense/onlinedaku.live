import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Banner from '@/models/Banner';

export async function GET() {
  try {
    await dbConnect();

    // Fetch only active banners and sort by displayOrder
    const banners = await Banner.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .select('title image link isActive');

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}