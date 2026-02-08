/**
 * Utility functions for authentication
 */

export function isAdminEmail(email: string): boolean {
  // Add admin emails here
  const adminEmails = [
    'admin@example.com',
    'Amourium.monde@gmail.com',
  ];
  
  return adminEmails.includes(email.toLowerCase());
}

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];
