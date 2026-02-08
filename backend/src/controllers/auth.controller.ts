import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { rateLimit } from 'express-rate-limit';
import { signToken, getJwtSecret } from '../utils/jwt-sync';
import type { StringValue } from 'ms';

// Configuration
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d') as StringValue;

// Error messages
const ERROR_MESSAGES = {
  REGISTRATION: {
    EMAIL_EXISTS: 'Email is already registered',
    VALIDATION: 'Validation error',
    SERVER: 'Error during registration'
  },
  LOGIN: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    SERVER: 'Error during login'
  },
  AUTH: {
    UNAUTHORIZED: 'Not authorized',
    USER_NOT_FOUND: 'User not found'
  }
};

interface IAuthResponse {
  success: boolean;
  message?: string;
  user?: Partial<IUser>;
  token?: string;
}

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response<IAuthResponse>) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and name'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.REGISTRATION.EMAIL_EXISTS
      });
    }

    // Create new user
    const user = await User.create({ email, password, name });

    // Generate JWT token
    const token = signToken(
      { id: user._id },
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Return response
    res.status(201).json({
      success: true,
      user: user.toJSON(),
      token
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.REGISTRATION.SERVER
    });
  }
};

/**
 * Login user and return JWT token
 */
export const login = async (req: Request, res: Response<IAuthResponse>) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.LOGIN.INVALID_CREDENTIALS
      });
    }

    // Generate JWT token
    const token = signToken(
      { id: user._id },
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return response
    res.json({
      success: true,
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.LOGIN.SERVER
    });
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  console.log('getAllUsers function called!');
  try {
    // @ts-ignore - We know user is set by auth middleware
    const user = req.user;
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: 'Admin access required' 
      });
    }
    
    const users = await User.find({})
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }) // Most recent first
      .lean();
      
    res.json({
      success: true,
      users
    });
    
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById((req as any).user?.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.AUTH.USER_NOT_FOUND
      });
    }
    
    res.json({
      success: true,
      user: user.toJSON()
    });
    
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
