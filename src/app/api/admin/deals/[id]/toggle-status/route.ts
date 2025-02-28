import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';
import { verifyToken } from '@/utils/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { isActive } = await request.json();

    await dbConnect();
    
    const deal = await Deal.findById(id);
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const updatedDeal = await Deal.findByIdAndUpdate(
      id,
      {
        isActive,
        updatedBy: admin._id,
      },
      { new: true }
    );

    return NextResponse.json({ deal: updatedDeal });
  } catch (error) {
    console.error('Deal status update error:', error);
    return NextResponse.json(
      { error: 'Failed to update deal status' },
      { status: 500 }
    );
  }
} 