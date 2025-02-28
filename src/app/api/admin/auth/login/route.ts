import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import Admin from '@/models/Admin';
import AdminActivity from '@/models/AdminActivity';
import jwt from 'jsonwebtoken';

// Add this line to disable edge runtime
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin and include password field
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if admin account is active
    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Account is disabled' },
        { status: 403 }
      );
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Log activity with separated fields
    try {
      await AdminActivity.create({
        admin: admin._id,
        action: 'LOGIN',
        ip: req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '::1',
        userAgent: req.headers.get('user-agent') || 'Unknown',
        additionalInfo: {
          timestamp: new Date(),
          success: true
        }
      });
    } catch (activityError) {
      console.error('Activity logging error:', activityError);
    }

    // Return success response with token
    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.log('Login error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}