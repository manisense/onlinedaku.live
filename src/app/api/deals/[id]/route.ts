import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database successfully');
    
    const { id } = await params;
    
    if (!id) {
      console.warn('Deal ID not provided');
      return NextResponse.json(
        { success: false, error: 'Deal ID is required' },
        { status: 400 }
      );
    }

    // Validate that the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`Invalid deal ID format: ${id}`);
      return NextResponse.json(
        { success: false, error: 'Invalid deal ID format' },
        { status: 400 }
      );
    }

    console.log(`Finding deal with ID: ${id}`);
    const deal = await Deal.findById(id).populate('category').lean();
    
    if (!deal) {
      console.warn(`Deal not found with ID: ${id}`);
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      );
    }

    console.log(`Deal found successfully with ID: ${id}`);
    return NextResponse.json({
      success: true,
      deal
    });
    
  } catch (error) {
    console.error('Error fetching deal:', error);
    
    // Provide more specific error messages based on the error type
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { success: false, error: 'Invalid deal ID format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deal details' },
      { status: 500 }
    );
  }
}
