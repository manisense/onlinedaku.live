import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyToken } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { path } = await request.json();

    if (!path) {
      return NextResponse.json({ success: false, error: 'Path is required' }, { status: 400 });
    }

    // Revalidate the provided path
    revalidatePath(path);

    return NextResponse.json({
      success: true,
      message: `Revalidated path: ${path}`,
    }, { status: 200 });
  } catch (error) {
    console.error('Error during revalidation:', error);
    return NextResponse.json({ success: false, error: 'Failed to revalidate path' }, { status: 500 });
  }
} 