import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/api/dbConnect';
import mongoose from 'mongoose';

// User schema for frontend API (matches backend schema)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.models.UserFrontend || mongoose.model('UserFrontend', UserSchema);
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email }).select('+password');
    
    console.log('Login attempt - Email:', email);
    console.log('User found:', !!user);
    
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { message: 'Invalid credentials - user not found' },
        { status: 401 }
      );
    }

    console.log('Stored password hash:', user.password);
    console.log('Comparing with password:', password);
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isPasswordValid);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create user object for response (without password)
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || (user as any).role === 'ADMIN' // Use database admin field
    };

    return NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token: 'mock-jwt-token' // In production, use real JWT
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
