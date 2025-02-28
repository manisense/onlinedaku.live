import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import connectDB from '@/utils/database';
import Setting from '@/models/Setting';

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    let settings = await Setting.findOne();

    // If no settings exist, create default settings
    if (!settings) {
      settings = await Setting.create({
        siteName: 'Online Daku',
        siteDescription: 'Your one-stop destination for the best deals and discounts',
        contactEmail: 'contact@onlinedaku.com',
        socialLinks: {
          facebook: '',
          twitter: '',
          instagram: '',
          telegram: ''
        },
        dealSettings: {
          defaultDealDuration: 30,
          maximumDiscountValue: 100,
          minimumDiscountValue: 0
        },
        seoSettings: {
          defaultTitle: 'Online Daku - Best Deals & Discounts',
          defaultDescription: 'Find the best deals and discounts online',
          defaultKeywords: 'deals, discounts, online shopping, coupons'
        }
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error in settings GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { settings } = await req.json();

    await connectDB();
    const updatedSettings = await Setting.findOneAndUpdate(
      {},
      settings,
      { new: true, upsert: true }
    );

    return NextResponse.json({ settings: updatedSettings });
  } catch (error) {
    console.error('Error in settings PUT:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
