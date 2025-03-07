import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';
import { verifyToken } from '@/utils/auth';

export const maxDuration = 60;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    await dbConnect();
    
    const deal = await Deal.findById(id);
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const updatedDeal = await Deal.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedBy: admin._id,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ deal: updatedDeal });
  } catch (error) {
    console.error('Deal update error:', error);
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();
    
    const deal = await Deal.findById(id);
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    await Deal.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Deal deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    );
  }
} 