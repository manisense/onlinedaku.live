import { NextRequest, NextResponse } from 'next/server';
//import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { tag } = await request.json();

    if (!tag) {
      return NextResponse.json({ 
        success: false, 
        message: 'Tag is required' 
      }, { status: 400 });
    }

    console.log(`Setting cache tag: ${tag}`);
    
    // In an actual implementation, we would do something with this tag
    // This is primarily for demonstration purposes
    
    return NextResponse.json({ 
      success: true, 
      message: `Cache tag set: ${tag}` 
    });
  } catch (error) {
    console.error('Error setting cache tag:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to set cache tag', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 