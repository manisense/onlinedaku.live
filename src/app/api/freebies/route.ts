import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Freebie from '@/models/Freebie';

interface FreebieQuery {
  isActive: boolean;
  category?: string;
  store?: { $regex: string; $options: string };
  $or?: Array<{
    title: { $regex: string; $options: string };
  } | {
    description: { $regex: string; $options: string };
  }>;
}

export async function GET(request: Request) {
  try {
    // Ensure database connection is established before proceeding
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const category = searchParams.get('category');
    const store = searchParams.get('store');
    const search = searchParams.get('search');

    const query: FreebieQuery = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (store) {
      query.store = { $regex: store, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const freebies = await Freebie.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Freebie.countDocuments(query);

    return NextResponse.json({
      freebies,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error in freebies API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const freebie = await Freebie.create(body);

    return NextResponse.json({ freebie }, { status: 201 });
  } catch (error) {
    console.error('Error creating freebie:', error);
    return NextResponse.json(
      { error: 'Failed to create freebie' },
      { status: 500 }
    );
  }
}