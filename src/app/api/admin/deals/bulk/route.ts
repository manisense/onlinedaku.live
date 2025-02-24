import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deal from '@/models/Deal';
import { verifyToken } from '@/utils/auth';

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, dealIds } = await req.json();

    if (!Array.isArray(dealIds) || dealIds.length === 0) {
      return NextResponse.json(
        { error: 'No deals selected' },
        { status: 400 }
      );
    }

    await dbConnect();

    switch (action) {
      case 'delete':
        await Deal.deleteMany({ _id: { $in: dealIds } });
        break;
      case 'activate':
        await Deal.updateMany(
          { _id: { $in: dealIds } },
          { 
            isActive: true,
            updatedBy: admin.id 
          }
        );
        break;
      case 'deactivate':
        await Deal.updateMany(
          { _id: { $in: dealIds } },
          { 
            isActive: false,
            updatedBy: admin.id 
          }
        );
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bulk action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
} 