import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import Blog from '@/models/Blog';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const tag = url.searchParams.get('tag');
    
    // Create query
    const query = { 
      isPublished: true,
      ...(tag ? { tags: tag } : {})
    };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch blogs with pagination
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Blog.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: blogs,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
