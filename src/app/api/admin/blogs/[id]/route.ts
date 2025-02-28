import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import Blog from '@/models/Blog';
import { verifyToken } from '@/utils/auth';

// Get a single blog by ID (for admin)
export async function GET(request: NextRequest, {params}:{ params: Promise<{id: string}>}) {
  try {
    // Verify admin token
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    
    const blog = await Blog.findById(id).lean();
    
    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: blog }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog' }, { status: 500 });
  }
}

// Update a blog post
export async function PUT(request: NextRequest, {params}:{ params: Promise<{id: string}>}) {
  try {
    // Verify admin token
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content || !body.slug || !body.excerpt) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, slug, content, and excerpt are required' 
      }, { status: 400 });
    }
    
    // Check for slug uniqueness (excluding current blog)
    const existingBlog = await Blog.findOne({ slug: body.slug, _id: { $ne: id } });
    if (existingBlog) {
      return NextResponse.json({ 
        success: false, 
        error: 'Another blog with this slug already exists' 
      }, { status: 400 });
    }
    
    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );
    
    if (!updatedBlog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedBlog }, { status: 200 });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ success: false, error: 'Failed to update blog' }, { status: 500 });
  }
}

// Delete a blog post
export async function DELETE(request: NextRequest, {params}:{ params: Promise<{id: string}>}) {
  try {
    // Verify admin token
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    
    const deletedBlog = await Blog.findByIdAndDelete(id);
    
    if (!deletedBlog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog' }, { status: 500 });
  }
}
