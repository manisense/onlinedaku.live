import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/database';
import CouponModel from '@/models/Coupon';

// Get a single coupon by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Coupon ID is required' }, { status: 400 });
    }

    const coupon = await CouponModel.findById(id).lean();

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch coupon', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// Update a coupon by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();

    console.log('Received update data:', data);

    if (!id) {
      return NextResponse.json({ success: false, message: 'Coupon ID is required' }, { status: 400 });
    }

    // Validate required fields
    if (!data.title) {
      return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    }

    if (data.type === 'Code' && !data.code) {
      return NextResponse.json({ success: false, message: 'Code is required for coupon codes' }, { status: 400 });
    }

    if (!data.store) {
      return NextResponse.json({ success: false, message: 'Store is required' }, { status: 400 });
    }

    // Check if coupon exists
    const existingCoupon = await CouponModel.findById(id);
    if (!existingCoupon) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }

    // Ensure offerId is preserved if not provided
    if (!data.offerId) {
      data.offerId = existingCoupon.offerId;
    }

    // Clean and prepare the data
    const couponData = {
      offerId: data.offerId,
      title: data.title,
      description: data.description || '',
      code: data.code || '',
      featured: Boolean(data.featured),
      url: data.url || '',
      affiliateLink: data.affiliateLink || '',
      imageUrl: data.imageUrl || '',
      brandLogo: data.brandLogo || '',
      type: data.type || 'Code',
      store: data.store,
      storeId: data.storeId || '',
      storeSlug: data.storeSlug || '',
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status || 'active',
      rating: Number(data.rating || 5),
      label: data.label || '',
      isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
    };

    console.log('Processed coupon data for update:', couponData);

    // Update coupon
    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      id,
      couponData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Coupon updated successfully',
      data: updatedCoupon
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update coupon', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// Partially update a coupon (e.g., toggle active status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'Coupon ID is required' }, { status: 400 });
    }

    // Check if coupon exists
    const existingCoupon = await CouponModel.findById(id);
    if (!existingCoupon) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }

    // Update only the specified fields
    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Coupon updated successfully',
      data: updatedCoupon
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update coupon', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// Delete a coupon by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Coupon ID is required' }, { status: 400 });
    }

    // Check if coupon exists
    const existingCoupon = await CouponModel.findById(id);
    if (!existingCoupon) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }

    // Delete coupon
    await CouponModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete coupon', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
} 