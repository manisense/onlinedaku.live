import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import dbConnect from '@/utils/dbConnect';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const admin = await verifyToken(req);
    
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Instead of using getPermissions method, determine permissions directly
    const permissions = admin.role === 'super_admin' 
      ? [
          'manage_deals',
          'manage_users',
          'manage_admins',
          'view_analytics',
          'manage_settings'
        ]
      : (admin.permissions || ['manage_deals', 'view_analytics']);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}