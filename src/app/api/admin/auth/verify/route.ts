import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import Admin from '@/models/Admin';
import dbConnect from '@/utils/dbConnect';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    await dbConnect();
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.getPermissions()
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
} 