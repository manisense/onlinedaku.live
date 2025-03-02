import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Category from '@/models/Category';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const parentOnly = searchParams.get('parentOnly') === 'true';
    const activeOnly = searchParams.get('activeOnly') !== 'false'; // Default to true
    
    // Define query interface based on Category model
    interface CategoryQuery {
      isActive?: boolean;
      parentCategory?: { $exists: boolean };
    }
    
    // Build query
    const query: CategoryQuery = {};
    
    if (activeOnly) {
      query.isActive = true;
    }
    
    if (parentOnly) {
      query.parentCategory = { $exists: false };
    }
    
    // Execute query
    const categories = await Category.find(query)
      .sort({ displayOrder: 1, name: 1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}