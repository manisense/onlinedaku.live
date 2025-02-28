import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import Admin from '@/models/Admin';
import dbConnect from './dbConnect';

export async function verifyToken(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
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
    console.error('Error verifying token:', error);
    return null;
  }
}