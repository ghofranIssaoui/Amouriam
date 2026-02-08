import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/api/dbConnect';
import User from '../../../models/User';

export async function POST() {
  try {
    await dbConnect();

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create demo users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@amourium.com',
        password: 'password',
        isAdmin: true
      },
      {
        name: 'Demo User',
        email: 'user@example.com',
        password: 'password',
        isAdmin: false
      },
      {
        name: 'Ghofran',
        email: 'ghofran@gmail.com',
        password: 'password',
        isAdmin: false
      }
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
        addresses: [],
        orders: [],
        wishlist: []
      });
      await user.save();
      console.log(`Created user: ${userData.email}`);
    }

    return NextResponse.json({
      message: 'Users seeded successfully!',
      users: users.map(u => ({ email: u.email, name: u.name }))
    });

  } catch (error) {
    console.error('Error seeding users:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { message: 'Error seeding users: ' + errorMessage },
      { status: 500 }
    );
  }
}
