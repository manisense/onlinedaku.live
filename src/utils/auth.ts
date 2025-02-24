import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import Admin from '@/models/Admin';
import dbConnect from './dbConnect';

export async function verifyToken(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    await dbConnect();
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isActive) {
      return null;
    }

    return {
      id: admin._id,
      role: admin.role,
      permissions: admin.getPermissions(),
    };
  } catch (error) {
    return null;
  }
} 