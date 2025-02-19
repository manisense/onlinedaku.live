import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const search = searchParams.get('search');

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build query object
    const query: {
      category?: string;
      $or?: Array<{
        [key: string]: { $regex: string; $options: string };
      }>;
    } = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    let sortQuery = {};
    switch (sort) {
      case 'latest':
        sortQuery = { createdAt: -1 };
        break;
      case 'discount':
        sortQuery = { discount: -1 };
        break;
      case 'popularity':
        sortQuery = { views: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    // Execute query with pagination
    const deals = await Deal.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Deal.countDocuments(query);

    // Format response
    const response = {
      data: deals.map(deal => ({
        id: (deal._id as { toString(): string }).toString(),
        title: deal.title,
        description: deal.description,
        image: deal.imageUrl,
        price: deal.price,
        originalPrice: deal.originalPrice,
        discount: deal.discount,
        category: deal.category,
        expiry: deal.expiresAt,
        dealUrl: deal.link
      })),
      pagination: {
        page,
        limit,
        total
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching homepage products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}