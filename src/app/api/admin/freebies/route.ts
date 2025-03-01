import { verifyToken } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isValidAdmin = await verifyToken(request);
    if (!isValidAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const freebie = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'store', 'category', 'link', 'startDate', 'endDate'];
    for (const field of requiredFields) {
      if (!freebie[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate dates
    const startDate = new Date(freebie.startDate);
    const endDate = new Date(freebie.endDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (endDate < startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // TODO: Save freebie to database
    // For now, return a mock success response
    return NextResponse.json(
      { 
        message: 'Freebie created successfully',
        data: {
          _id: 'mock-id-' + Date.now(),
          ...freebie,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating freebie:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isValidAdmin = await verifyToken(request);
    if (!isValidAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // TODO: Fetch freebies from database
    // For now, return mock data
    const mockFreebies = Array(limit).fill(null).map((_, index) => ({
      _id: `mock-id-${index}`,
      title: `Mock Freebie ${index + 1}`,
      description: 'Mock description',
      store: 'Mock Store',
      category: 'Software',
      image: '/product-placeholder.png',
      link: 'https://example.com',
      termsAndConditions: 'Mock terms',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return NextResponse.json({
      data: mockFreebies,
      meta: {
        currentPage: page,
        totalPages: 5,
        totalItems: 50,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Error fetching freebies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isValidAdmin = await verifyToken(request);
    if (!isValidAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract freebie ID from URL
    const freebieId = request.url.split('/').pop();
    if (!freebieId) {
      return NextResponse.json(
        { error: 'Freebie ID is required' },
        { status: 400 }
      );
    }

    // TODO: Delete freebie from database
    // For now, return a mock success response
    return NextResponse.json(
      { message: 'Freebie deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting freebie:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}