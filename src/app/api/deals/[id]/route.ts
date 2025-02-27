import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Deal ID is required' },
        { status: 400 }
      );
    }

    const deal = await Deal.findById(id).lean();
    
    if (!deal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deal
    });
    
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deal details' },
      { status: 500 }
    );
  }
}
