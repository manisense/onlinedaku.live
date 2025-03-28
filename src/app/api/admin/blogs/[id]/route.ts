import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import Blog from '@/models/Blog';
import { verifyToken } from '@/utils/auth';

// Get a single blog by ID (for admin)
export async function GET(request: NextRequest, {params}:{ params: Promise<{id: string}>}) {
  try {
    // Verify admin token
    console.log('Incoming headers:', request.headers);
    console.log('Request URL:', request.url);
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
    
    console.log('Updating blog with ID:', id);
    console.log('Request body received:', JSON.stringify({
      title: body.title,
      slug: body.slug,
      coverImage: body.coverImage ? 'present' : 'not present',
      contentLength: body.content ? body.content.length : 0,
      excerpt: body.excerpt ? 'present' : 'not present',
      tags: body.tags,
      isPublished: body.isPublished
    }));
    
    // Validate required fields
    if (!body.title || !body.content || !body.slug || !body.excerpt) {
      console.error('Missing required fields:', {
        title: !body.title,
        content: !body.content,
        slug: !body.slug,
        excerpt: !body.excerpt
      });
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
    
    // Create an update object with all fields explicitly
    const updateData = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      coverImage: body.coverImage,
      tags: body.tags || [],
      isPublished: body.isPublished || false,
      updatedAt: new Date()
    };
    
    console.log('Final update data:', JSON.stringify({
      ...updateData,
      content: updateData.content ? 'content present' : 'no content',
    }));
    
    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedBlog) {
      console.error('Blog not found with ID:', id);
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    
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
        console.log('Blog revalidation successful after update');
      }
    } catch (revalidateError) {
      console.error('Error triggering revalidation:', revalidateError);
    }
    
    console.log('Blog updated successfully:', updatedBlog._id);
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
        console.log('Blog revalidation successful after deletion');
      }
    } catch (revalidateError) {
      console.error('Error triggering revalidation:', revalidateError);
    }
    
    return NextResponse.json({ success: true, message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog' }, { status: 500 });
  }
}
