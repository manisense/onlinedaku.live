import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';
import Category from '@/models/Category';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const categorySlug = searchParams.get('category');
    const store = searchParams.get('store');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'newest';
    
    const now = new Date();
    
    // Define query interface based on Deal model
    interface DealQuery {
      isActive: boolean;
      startDate: { $lte: Date };
      endDate: { $gt: Date };
      category?: { $in: mongoose.Types.ObjectId[] };
      store?: string;
    }
    
    // Build query
    const query: DealQuery = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gt: now }
    };
    
    // If category slug is provided, find the category ID first
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        // Find all subcategories of this category
        const subcategories = await Category.find({ parentCategory: category._id });
        const categoryIds = [category._id, ...subcategories.map(sub => sub._id)];
        query.category = { $in: categoryIds };
      }
    }
    
    if (store) {
      query.store = store;
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    let sort = {};
    switch (sortBy) {
      case 'discount':
        sort = { discountValue: -1 };
        break;
      case 'price':
        sort = { price: 1 };
        break;
      case 'priceDesc':
        sort = { price: -1 };
        break;
      default: // newest
        sort = { createdAt: -1 };
    }
    
    // Get total count for pagination
    const totalDeals = await Deal.countDocuments(query);
    const totalPages = Math.ceil(totalDeals / limit);
    
    // Get deals with pagination and populate category
    const deals = await Deal.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      success: true,
      deals,
      pagination: {
        currentPage: page,
        totalPages,
        total: totalDeals,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}