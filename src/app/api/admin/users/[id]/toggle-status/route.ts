import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import connectDB from '@/utils/database';
import User from '@/models/User';

export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyToken(req);
    if (!admin || (!admin.permissions.includes('manage_users') && admin.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { isActive } = await req.json();
    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    const { id } = await params;
    
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    user.isActive = isActive;
    await user.save();
    
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        isVerified: user.isVerified
      }
    });
    
  } catch (error) {
    console.error('Error toggling user status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
}
