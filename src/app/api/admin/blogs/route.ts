import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import Blog from '@/models/Blog';
import { verifyToken } from '@/utils/auth';

// Get all blogs for admin (including unpublished)
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const url = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch blogs with pagination
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Blog.countDocuments();
    
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

// Create a new blog post
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content || !body.slug) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, slug, and content are required' 
      }, { status: 400 });
    }
    
    // Ensure excerpt is generated if not provided
    if (!body.excerpt) {
      // Extract first 150 characters from content, strip HTML tags, and add ellipsis
      body.excerpt = body.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...';
    }
    
    // Check for slug uniqueness
    const existingBlog = await Blog.findOne({ slug: body.slug });
    if (existingBlog) {
      return NextResponse.json({ 
        success: false, 
        error: 'A blog with this slug already exists' 
      }, { status: 400 });
    }
    
    // Create new blog
    const newBlog = await Blog.create({
      ...body,
      author: admin._id
    });
    
    // Trigger revalidation
    try {
      const revalidateUrl = new URL(
        `/api/revalidate-blogs?token=${process.env.REVALIDATION_SECRET}`,
        process.env.NEXT_PUBLIC_APP_URL
      ).toString();
      
      const revalidateRes = await fetch(revalidateUrl, {
        method: 'GET',
        cache: 'no-store',
      });
      
      if (!revalidateRes.ok) {
        console.error('Revalidation failed:', await revalidateRes.text());
      } else {
        console.log('Blog revalidation successful after creation');
      }
    } catch (revalidateError) {
      console.error('Error triggering revalidation:', revalidateError);
    }
    
    return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ success: false, error: 'Failed to create blog' }, { status: 500 });
  }
}
