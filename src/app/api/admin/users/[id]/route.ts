import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import connectDB from '@/utils/database';
import User from '@/models/User';

export const runtime = 'nodejs';

// Get a specific user
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyToken(req);
    if (!admin || (!admin.permissions.includes('manage_users') && admin.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    
    const user = await User.findById(id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ user });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// Update a user
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const admin = await verifyToken(req);
    if (!admin || (!admin.permissions.includes('manage_users') && admin.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const userData = await req.json();
    const { id } = await params;
    
    // Find user
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Update fields
    if (userData.name !== undefined) user.name = userData.name;
    if (userData.email !== undefined) {
      // Check if email is already in use by another user
      if (userData.email !== user.email) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
          return NextResponse.json(
            { error: 'Email already in use' },
            { status: 400 }
          );
        }
      }
      user.email = userData.email;
    }
    
    if (userData.password) user.password = userData.password;
    if (userData.isActive !== undefined) user.isActive = userData.isActive;
    if (userData.isVerified !== undefined) user.isVerified = userData.isVerified;
    
    // Save updates
    await user.save();
    //const { id } = await params;
    
    // Return updated user without password
    const updatedUser = await User.findById(id).select('-password');
    
    return NextResponse.json({ user: updatedUser });
    
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// Delete a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyToken(req);
    if (!admin || (!admin.permissions.includes('manage_users') && admin.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
