import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import dbConnect from '@/utils/dbConnect';
import { Store } from '@/models/Store';

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();

    // Connect to database
    await dbConnect();

    // Validate required fields
    const { name, description, website, logo, isActive } = body;
    if (!name || !description || !website) {
      return NextResponse.json(
        { error: 'Name, description and website are required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check if store with same slug exists
    const existingStore = await Store.findOne({ slug });
    if (existingStore) {
      return NextResponse.json(
        { error: 'A store with this name already exists' },
        { status: 400 }
      );
    }

    // Create store document
    const store = await Store.create({
      name,
      slug,
      description,
      website,
      logo: logo || '',
      isActive: isActive ?? true,
      createdBy: admin._id,
      updatedBy: admin._id
    });

    return NextResponse.json(
      { message: 'Store created successfully', store },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating store:', error);
    return NextResponse.json(
      { error: 'Failed to create store' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Connect to database
    try {
      await dbConnect();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalStores = await Store.countDocuments();
    const totalPages = Math.ceil(totalStores / limit);

    // Get stores with pagination and sorting
    const stores = await Store.find()
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    if (!stores) {
      return NextResponse.json(
        { error: 'No stores found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      stores,
      pagination: {
        currentPage: page,
        totalPages,
        totalStores,
        hasMore: page < totalPages
      }
    });

  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stores', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}