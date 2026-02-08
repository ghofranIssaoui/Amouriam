// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/api/dbConnect';
import User, { IUser } from '@/models/User';
import { isAdminEmail, ROLES } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Determine if this should be an admin user
    const role = isAdminEmail(email) ? ROLES.ADMIN : ROLES.USER;

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      isAdmin: role === ROLES.ADMIN,
      addresses: [],
      orders: [],
      wishlist: []
    });

    await user.save();

    // Create user object for response (without sensitive data)
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: (user as any).role,
      isAdmin: user.isAdmin
    };

    return NextResponse.json({
      message: 'User created successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}