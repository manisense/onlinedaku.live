import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Admin from '@/models/Admin';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    
    // Get connection info
    const connectionState = mongoose.connection.readyState;
    const connectionStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    // Get all admins with basic info
    const admins = await Admin.find({}).lean();
    
    return NextResponse.json({
      connection: {
        status: connectionStates[connectionState],
        databaseName: mongoose.connection.name,
        collections: collections.map(c => c.name)
      },
      adminCount: admins.length,
      admins: admins.map(admin => ({
        id: admin._id,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }))
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 