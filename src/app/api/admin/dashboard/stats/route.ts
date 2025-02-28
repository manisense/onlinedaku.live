import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import connectDB from '@/utils/database';
import Admin from '@/models/Admin';
import AdminActivity from '@/models/AdminActivity';
import Deal from '@/models/Deal';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get recent activities
    console.log('Getting recent activities', req);
    const recentActivities = await AdminActivity.find()
      .populate('admin', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get admin count
    const adminCount = await Admin.countDocuments();

    // Fetch stats
    const totalDeals = await Deal.countDocuments();
    const activeDeals = await Deal.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();
    
    // Fetch recent deals
    const recentDeals = await Deal.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title store createdAt isActive');

    // Mock alerts (implement your own alert system)
    const alerts = [
      {
        _id: '1',
        message: 'New user registration spike detected',
        type: 'info',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        message: '5 deals expiring today',
        type: 'warning',
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        recentActivities,
        stats: {
          adminCount,
          totalDeals,
          activeDeals,
          totalUsers,
          totalViews: 1234, // Implement actual view tracking
          monthlyGrowth: 15
        },
        recentDeals: recentDeals.map(deal => ({
          _id: deal._id,
          title: deal.title,
          store: deal.store,
          createdAt: deal.createdAt,
          status: deal.isActive ? 'active' : 'inactive'
        })),
        alerts
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}