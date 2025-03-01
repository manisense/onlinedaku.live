import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Admin from '@/models/Admin';
import dbConnect from './dbConnect';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export async function verifyToken(request: NextRequest) {
  try {
    // Check for token in cookies first
    let token = request.cookies.get('adminToken')?.value;
    
    // If not in cookies, check Authorization header
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await dbConnect();
    const admin = await Admin.findById(decoded.id);
    
    if (!admin) return null;

    // Return admin document directly
    return {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions || ['manage_deals', 'view_analytics'],
      isActive: admin.isActive
    };

  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('adminToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('adminToken');
}