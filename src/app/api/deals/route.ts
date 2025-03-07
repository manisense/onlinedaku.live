import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';
import Category from '@/models/Category';
import { Types } from 'mongoose';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log('Connected to database for deals fetch');
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const categorySlug = searchParams.get('category');
    const store = searchParams.get('store');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'newest';
    
    const now = new Date();
    
    // Define query interface with proper typing
    interface DealQuery {
      isActive: boolean;
      startDate: { $lte: Date };
      endDate: { $gt: Date };
      category?: { $in: Types.ObjectId[] }; // Use 'any' temporarily to handle both string and ObjectId
      store?: string;
    }
    
    // Build query
    const query: DealQuery = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gt: now }
    };
    
    console.log('Building query with params:', { categorySlug, store, page, limit });
    
    // If category slug is provided, find the category ID first
    if (categorySlug) {
      try {
        const category = await Category.findOne({ slug: categorySlug });
        if (category) {
          // Find all subcategories of this category
          const subcategories = await Category.find({ parentCategory: category._id });
          const categoryIds = [
            category._id, 
            ...subcategories.map(sub => sub._id)
          ];
          query.category = { $in: categoryIds };
        } else {
          console.log(`Category with slug ${categorySlug} not found`);
        }
      } catch (err) {
        console.error('Error finding category:', err);
        // Don't fail the whole request if category lookup fails
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
    
    console.log('Final query:', JSON.stringify(query));
    
    // Get all deals with proper handling for categories
    try {
      // Get deals with pagination
      const deals = await Deal.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
      
      // Count total deals for pagination
      const totalDeals = await Deal.countDocuments(query);
      
      console.log(`Found ${totalDeals} deals, returning ${deals.length}`);
      
      if (deals.length === 0 && page === 1) {
        // If no deals found with filters on first page, return newest deals as fallback
        const recentDeals = await Deal.find({ isActive: true })
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();
        
        return NextResponse.json({
          success: true,
          deals: recentDeals,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            total: recentDeals.length,
            hasMore: false
          }
        });
      }
      
      // Process deals to ensure category is properly formatted
      const processedDeals = deals.map(deal => {
        // If category is a string, leave it as is
        // If it's an ObjectId reference, it will be returned as is
        return {
          ...deal,
          // You can add additional processing here if needed
        };
      });
      
      const totalPages = Math.ceil(totalDeals / limit);
      
      return NextResponse.json({
        success: true,
        deals: processedDeals,
        pagination: {
          currentPage: page,
          totalPages,
          total: totalDeals,
          hasMore: page < totalPages
        }
      });
    } catch (error) {
      console.error('Error processing deals:', error);
      throw error; // Re-throw to be caught by outer try-catch
    }
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deals', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}