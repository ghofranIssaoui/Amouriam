'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Types
export interface User {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  is2FAEnabled: boolean;
  // Token is now stored in httpOnly cookie
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, code?: string) => Promise<{ requires2FA: boolean; user?: User }>;
  verify2FA: (userId: string, code: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  csrfToken: string | null;
  pending2FAUser: { email: string; userId: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [pending2FAUser, setPending2FAUser] = useState<{ email: string; userId: string } | null>(null);
  const router = useRouter();

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/auth/csrf', {
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/auth/me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken || '',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (csrfToken) {
      loadUser();
    }
  }, [csrfToken]);

  // Login function with rate limiting
  const login = useCallback(async (email: string, password: string, code?: string) => {
    try {
      setError(null);
      setIsLoading(true);

      // Get CSRF token first
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const csrfResponse = await fetch(`${apiUrl}/api/auth/csrf`);
      const { csrfToken } = await csrfResponse.json();
      setCsrfToken(csrfToken);

      // Prepare login data
      const loginData: any = { email, password };
      if (code) {
        loginData.code = code;
      }

      // Attempt to log in
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      const responseData = await response.json();

      if (response.status === 206) {
        // 206 Partial Content - 2FA required
        setPending2FAUser({ email, userId: responseData.userId });
        return { requires2FA: true, user: responseData.user };
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Login failed');
      }

      // Regular successful login
      setUser(responseData);
      setPending2FAUser(null);
      
      // Store user data in localStorage (excluding sensitive info)
      localStorage.setItem('user', JSON.stringify({
        _id: responseData._id,
        email: responseData.email,
        name: responseData.name,
        isAdmin: responseData.isAdmin,
        is2FAEnabled: responseData.is2FAEnabled,
      }));

      // Redirect to home page or intended URL
      const returnTo = new URLSearchParams(window.location.search).get('returnTo');
      router.push(returnTo || '/');
      
      return { requires2FA: false };
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const verify2FA = useCallback(async (userId: string, code: string) => {
    try {
      setError(null);
      setIsLoading(true);

      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/verify-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ userId, code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '2FA verification failed');
      }

      const userData = await response.json();
      setUser(userData);
      setPending2FAUser(null);
      
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        _id: userData._id,
        email: userData.email,
        name: userData.name,
        isAdmin: userData.isAdmin,
        is2FAEnabled: userData.is2FAEnabled,
      }));

      // Redirect to home page or intended URL
      const returnTo = new URLSearchParams(window.location.search).get('returnTo');
      router.push(returnTo || '/');
    } catch (err: any) {
      setError(err.message || 'Failed to verify 2FA code');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [csrfToken, router]);

  // Signup function with validation
  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Input validation
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto-login after successful registration
      await login(email, password);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during registration';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [csrfToken, login]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken || '',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear client-side state
      setUser(null);
      deleteCookie('auth_token');
      router.push('/login');
    }
  }, [csrfToken, router]);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Auto-logout on inactivity
  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000); // 30 minutes of inactivity
    };

    // Set up event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initial timer
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, logout]);

  return (
    <AuthContext.Provider 
      value={{
        user,
        login,
        verify2FA,
        signup,
        logout,
        isLoading,
        error,
        isAuthenticated,
        csrfToken,
        pending2FAUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};