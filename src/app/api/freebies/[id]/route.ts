import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Freebie from '@/models/Freebie';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Ensure database connection is established before proceeding
    await dbConnect();

    const { id } = await params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid freebie ID format' },
        { status: 400 }
      );
    }

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