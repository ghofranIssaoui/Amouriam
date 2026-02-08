// app/api/user/statistics/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/api/dbConnect';
import mongoose from 'mongoose';

// User schema for frontend API
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  isAdmin: { type: Boolean, default: false },
  addresses: [{ type: mongoose.Schema.Types.Mixed }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderFrontend' }]
}, { timestamps: true });

// Order schema for frontend API
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserFrontend', required: true },
  total: { type: Number, required: true },
  status: { type: String, required: true, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
  items: [{ type: mongoose.Schema.Types.Mixed }]
}, { timestamps: true });

const User = mongoose.models.UserFrontend || mongoose.model('UserFrontend', UserSchema);
const Order = mongoose.models.OrderFrontend || mongoose.model('OrderFrontend', OrderSchema);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
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