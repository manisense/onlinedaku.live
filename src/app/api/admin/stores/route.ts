import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import dbConnect from '@/utils/dbConnect';
import { Store } from '@/models/Store';
import connectDB from '@/utils/database';

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
    // Check authentication (optional check - uncomment if needed)
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    // }

    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const query = activeOnly ? { isActive: true } : {};
    
    const stores = await Store.find(query)
      .select('_id name slug logo isActive')
      .sort({ name: 1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: stores
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching stores' },
      { status: 500 }
    );
  }
}