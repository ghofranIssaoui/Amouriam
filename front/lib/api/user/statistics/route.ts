// app/api/user/statistics/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import dbConnect from '@/lib/api/dbConnect';
import User from '@/backend/src/models/User';
import Order from '@/backend/src/models/Order';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get user with populated orders
    const user = await User.findById(session.user.id).populate({
      path: 'orders',
      select: 'total status',
      match: { status: { $ne: 'cancelled' } } // Exclude cancelled orders from total
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const totalSpent = user.orders?.reduce((sum: number, order: any) => {
      return sum + (order.total || 0);
    }, 0) || 0;

    const statistics = {
      accountCreated: user.createdAt,
      totalOrders: user.orders?.length || 0,
      totalSpent,
      savedAddresses: user.addresses?.length || 0,
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}