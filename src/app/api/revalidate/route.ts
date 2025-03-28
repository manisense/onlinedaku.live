import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// Secret token for revalidation
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'default-revalidation-secret';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, secret } = body;

    // Validate secret token
    if (secret !== REVALIDATION_SECRET) {
      console.error('Invalid revalidation secret');
      return NextResponse.json({ success: false, error: 'Invalid secret' }, { status: 401 });
    }

    if (!path && !tag) {
      console.error('No path or tag provided for revalidation');
      return NextResponse.json({ 
        success: false, 
        error: 'Either path or tag is required' 
      }, { status: 400 });
    }

    // Revalidate based on path or tag
    if (path) {
      console.log(`Revalidating path: ${path}`);
      revalidatePath(path);
    }
    
    if (tag) {
      console.log(`Revalidating tag: ${tag}`);
      revalidateTag(tag);
    }

    console.log('Revalidation successful');
    return NextResponse.json({
      success: true,
      revalidated: true,
      message: `Revalidated ${path ? `path: ${path}` : ''}${tag ? `tag: ${tag}` : ''}`,
      now: Date.now()
    }, { status: 200 });
  } catch (error) {
    console.error('Error during revalidation:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to revalidate',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 