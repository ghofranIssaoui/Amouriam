// backend/src/utils/jwt-sync.ts
import jwt from 'jsonwebtoken';

// Standard JWT secrets for backward compatibility
export const JWT_SECRETS = [
  process.env.JWT_SECRET,
  'your-secret-key',
  'amourium-secret-key',
  'default-jwt-secret'
].filter(Boolean) as string[];

// Get the primary JWT secret
export const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'your-secret-key';
};

// Verify token with multiple secrets for backward compatibility
export const verifyTokenWithFallback = (token: string) => {
  let lastError = null;
  
  for (const secret of JWT_SECRETS) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      lastError = err;
      continue;
    }
  }
  
  throw lastError || new Error('Token verification failed');
};

// Sign token with current secret
export const signToken = (payload: any, options?: jwt.SignOptions) => {
  return jwt.sign(payload, getJwtSecret(), options);
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;
    
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};
