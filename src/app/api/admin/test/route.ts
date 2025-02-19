import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Admin from '@/models/Admin';

export async function GET() {
  try {
    await dbConnect();
    
    // Find admin with password field
    const admin = await Admin.findOne({ email: 'admin@onlinedaku.live' }).select('+password');
    
    return NextResponse.json({ 
      exists: !!admin,
      admin: admin ? {
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        hasPassword: !!admin.password,
        passwordLength: admin.password?.length,
        permissions: admin.permissions
      } : null 
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 