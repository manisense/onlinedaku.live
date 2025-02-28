import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import Blog from '@/models/Blog';

export async function GET(request: NextRequest, {params}:{ params: Promise<{slug: string}>}) {
  try {
    await connectDB();
    const { slug } = await params;
    
    const blog = await Blog.findOne({ slug, isPublished: true }).lean();
    
    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: blog }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog' }, { status: 500 });
  }
}
