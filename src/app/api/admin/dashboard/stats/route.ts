import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Admin from '@/models/Admin';
import AdminActivity from '@/models/AdminActivity';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get recent activities
    console.log('Getting recent activities', req);
    const recentActivities = await AdminActivity.find()
      .populate('admin', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get admin count
    const adminCount = await Admin.countDocuments();

    // TODO: Add more stats when other models are ready
    // const dealCount = await Deal.countDocuments();
    // const userCount = await User.countDocuments();
    // const couponCount = await Coupon.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        recentActivities,
        stats: {
          adminCount,
          // Add more stats here
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 