import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { verifyTokenWithFallback, getJwtSecret } from '../utils/jwt-sync';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        isAdmin: boolean;
        email: string;
        name: string;
      };
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Auth middleware - Request URL:', req.originalUrl);
    console.log('Auth middleware - Request method:', req.method);
    
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Auth middleware - No token found');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token with fallback secrets
    let decoded;
    try {
      decoded = verifyTokenWithFallback(token);
      console.log('Auth middleware - Token verified successfully');
    } catch (err: any) {
      console.error('Auth middleware - Token verification failed:', err.message);
      return res.status(401).json({ 
        message: 'Token is not valid',
        requiresReauth: true,
        error: 'Token signature mismatch - please login again'
      });
    }

    console.log('Auth middleware - Decoded token:', decoded);
    
    // Verify user still exists in database
    const user = await User.findById((decoded as any).id);
    if (!user) {
      console.log('Auth middleware - User not found in database');
      return res.status(401).json({ 
        message: 'User not found',
        requiresReauth: true
      });
    }

    // Add user from payload
    req.user = { 
      _id: (decoded as any).id,
      isAdmin: user.isAdmin,
      email: user.email,
      name: user.name
    };
    console.log('Auth middleware - User authenticated successfully');
    next();
  } catch (err: any) {
    console.error('Auth middleware - Unexpected error:', err);
    res.status(401).json({ 
      message: 'Authentication failed',
      requiresReauth: true,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
