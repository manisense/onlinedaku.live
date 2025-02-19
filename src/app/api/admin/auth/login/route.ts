import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Admin from '@/models/Admin';
import AdminActivity from '@/models/AdminActivity';
import { sign } from 'jsonwebtoken';
import mongoose from 'mongoose';

// Add this line to disable edge runtime
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    console.log('Starting login process...');
    await dbConnect();
    
    // Check database connection
    console.log('Database name:', mongoose.connection.name);
    console.log('Connection state:', mongoose.connection.readyState);
    
    const collections = mongoose.connection.db ? await mongoose.connection.db.listCollections().toArray() : [];
    console.log('Available collections:', collections.map(c => c.name));
    
    const body = await req.json();
    const { email, password } = body;

    console.log('Login attempt for:', email);
    console.log('Received password length:', password?.length);

    // First, let's check if the admin exists without password
    const adminExists = await Admin.findOne({ email });
    console.log('Admin exists check:', !!adminExists);
    
    // Then get admin with password using explicit query
    const admin = await Admin.findOne({ 
      email: email.toLowerCase() // ensure case-insensitive match
    }).select('+password');

    console.log('Admin found with password:', !!admin);
    
    if (admin) {
      console.log('Admin details:', {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        hasPassword: !!admin.password,
        passwordLength: admin.password?.length,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      });
    }

    if (!admin) {
      // Let's check what admins exist in the database
      const allAdmins = await Admin.find({}, 'email');
      console.log('All admin emails in DB:', allAdmins.map(a => a.email));
      
      console.log('No admin found with email:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Attempting password comparison...');
    const isPasswordValid = await admin.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      console.log('Account is deactivated:', email);
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Log activity
    await AdminActivity.create({
      admin: admin._id,
      action: 'login',
      details: {
        ip: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown'
      },
      ipAddress: req.headers.get('x-forwarded-for'),
      userAgent: req.headers.get('user-agent')
    });

    // Create token
    const token = sign(
      { 
        id: admin._id,
        role: admin.role,
        permissions: admin.getPermissions()
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.getPermissions()
      }
    });

    // Set the token as an HTTP-only cookie
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 1 day
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 