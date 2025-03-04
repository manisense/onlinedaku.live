import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import CouponModel from '@/models/Coupon';


// Handler for POST requests - create a new coupon
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Get a flexible Coupon model
    const data = await request.json();
    console.log("Received coupon data:", data);
    
    // Only validate minimal requirements
    if (!data.title) {
      return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    }
    
    if (!data.store) {
      return NextResponse.json({ success: false, message: 'Store is required' }, { status: 400 });
    }
    
    // Generate a unique offerId if not provided
    if (!data.offerId) {
      data.offerId = `custom-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    // Clean and prepare the data - keep only fields from our sample object
    const couponData = {
      offerId: data.offerId,
      title: data.title,
      description: data.description || '',
      code: data.code || '',
      featured: Boolean(data.featured) || false,
      url: data.url || '',
      affiliateLink: data.affiliateLink || '',
      imageUrl: data.imageUrl || '',
      brandLogo: data.brandLogo || '',
      type: data.type || 'Code', // Default to Code
      store: data.store,
      storeSlug: data.storeSlug || '',
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      status: data.status || 'active',
      rating: Number(data.rating || 5),
      label: data.label || '',
      isActive: data.isActive !== false,
      // Let MongoDB handle timestamps
    };

    console.log("Processed coupon data:", couponData);

    // Create new coupon with cleaned data
    const newCoupon = await (CouponModel).create(couponData);
    console.log("Created coupon:", newCoupon);
    
    return NextResponse.json({
      success: true,
      message: 'Coupon created successfully',
      data: newCoupon
    });
  } catch (error) {
    // Log detailed error information
    console.error('Error creating coupon:', error);
   
    return NextResponse.json(
      { success: false, message: 'Error creating coupon: ' },
      { status: 500 }
    );
  }
}

// Keep existing GET handler with flexible model
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const [coupons, totalCoupons] = await Promise.all([
      CouponModel.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CouponModel.countDocuments({})
    ]);
    
    return NextResponse.json({
      success: true,
      coupons,
      totalPages: Math.ceil(totalCoupons / limit),
      currentPage: page
    });
  } catch (error: unknown) {
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, message: 'Error fetching coupons: ' + errorMessage },
      { status: 500 }
    );
  }
}