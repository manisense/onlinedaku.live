import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import connectDB from '@/utils/database';
import User from '@/models/User';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyToken(req);
    if (!admin || (!admin.permissions.includes('view_analytics') && admin.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get active users
    const activeUsers = await User.countDocuments({ isActive: true });
    
    // Get verified users
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    
    // Get users created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    // Get users logged in in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyActiveUsers = await User.countDocuments({ 
      lastLogin: { $gte: sevenDaysAgo } 
    });
    
    // Monthly growth calculation
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const usersLastMonth = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo, $lte: new Date() } 
    });
    
    const usersPreviousMonth = await User.countDocuments({ 
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
    });
    
    let monthlyGrowth = 0;
    if (usersPreviousMonth > 0) {
      monthlyGrowth = Math.round(((usersLastMonth - usersPreviousMonth) / usersPreviousMonth) * 100);
    } else if (usersLastMonth > 0) {
      monthlyGrowth = 100; // If we had no users before but we do now, that's 100% growth
    }
    
    return NextResponse.json({
      totalUsers,
      activeUsers,
      verifiedUsers,
      newUsers,
      recentlyActiveUsers,
      monthlyGrowth
    });
    
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}
