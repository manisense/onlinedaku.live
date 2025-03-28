import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// Creating a specific route just for blog revalidation
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const slug = request.nextUrl.searchParams.get('slug');
  const secret = process.env.REVALIDATION_SECRET || 'default-revalidation-secret';

  // Check the token against our secret
  if (token !== secret) {
    return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
  }

  try {
    // Log this revalidation action
    console.log(`[${new Date().toISOString()}] Blog revalidation requested`);
    
    // Revalidate using paths (for more targeted revalidations)
    revalidatePath('/blog');
    
    if (slug) {
      // If a specific slug is provided, only revalidate that blog
      revalidatePath(`/blog/${slug}`);
      console.log(`Revalidated specific blog: /blog/${slug}`);
    } else {
      // Otherwise revalidate all blogs with a pattern
      revalidatePath('/blog/[slug]', 'page');
      console.log('Revalidated all blog pages');
    }
    
    // Also revalidate using tags (for broader revalidations)
    revalidateTag('blog-data');
    
    if (slug) {
      revalidateTag(`blog-${slug}`);
    }
    
    console.log(`[${new Date().toISOString()}] Successfully revalidated all blog pages`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog pages revalidated successfully',
      revalidated: true,
      now: Date.now(),
      paths: ['/blog', slug ? `/blog/${slug}` : '/blog/[slug]'],
      tags: ['blog-data', slug ? `blog-${slug}` : null].filter(Boolean)
    });
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error revalidating blog pages',
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 