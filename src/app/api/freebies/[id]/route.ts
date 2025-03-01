import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Freebie from '@/models/Freebie';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;

    const freebie = await Freebie.findById(id);
    
    if (!freebie) {
      return NextResponse.json(
        { error: 'Freebie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ freebie });
  } catch (error) {
    console.error('Error fetching freebie:', error);
    return NextResponse.json(
      { error: 'Failed to fetch freebie details' },
      { status: 500 }
    );
  }
}