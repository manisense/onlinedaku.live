import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';
import Blog from '@/models/Blog';
import { IDeal } from '@/models/Deal';
import { IBlog } from '@/models/Blog';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ results: [] });
    }
    
    await dbConnect();
    
    // Search deals with proper typing
    const deals = await Deal.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { store: { $regex: query, $options: 'i' } },
      ],
      isActive: true,
    }).lean() as unknown as (IDeal & { _id: { toString(): string } })[];
    
    // Search blogs with proper typing
    const blogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { summary: { $regex: query, $options: 'i' } },
      ],
      isPublished: true,
    }).lean() as unknown as (IBlog & { _id: { toString(): string } })[];
    
    // Format results
    const dealResults = deals.map(deal => ({
      id: deal._id.toString(),
      title: deal.title,
      type: 'deal',
      url: `/deal/${deal._id}`,
      image: deal.image,
      description: deal.description?.substring(0, 100),
      price: deal.price,
      originalPrice: deal.originalPrice,
      discountValue: deal.discountValue
    }));
    
    const blogResults = blogs.map(blog => ({
      id: blog._id.toString(),
      title: blog.title,
      type: 'blog',
      url: `/blog/${blog.slug}`,
      image: blog.featuredImage,
      description: blog.summary?.substring(0, 100) || blog.content?.substring(0, 100),
    }));
    
    // Combine and sort results
    const results = [...dealResults, ...blogResults].sort((a, b) => {
      // Sort by relevance - if title contains the query, prioritize it
      const aHasQueryInTitle = a.title.toLowerCase().includes(query.toLowerCase());
      const bHasQueryInTitle = b.title.toLowerCase().includes(query.toLowerCase());
      
      if (aHasQueryInTitle && !bHasQueryInTitle) return -1;
      if (!aHasQueryInTitle && bHasQueryInTitle) return 1;
      return 0;
    });
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
} 