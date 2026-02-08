// Simple logger using console instead of Prisma
// You can replace this with MongoDB logging later if needed

type ActionType = 
  | 'LOGIN_ATTEMPT'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET_SUCCESS'
  | 'ADMIN_USER_EDITED'
  | 'ADMIN_USER_DELETED';

export interface LogActionParams {
  userId: string;
  action: ActionType;
  metadata?: Record<string, unknown>;
  ip?: string | string[] | null;
  userAgent?: string | null;
}

export async function logAction({
  userId,
  action,
  metadata = {},
  ip = null,
  userAgent = null,
}: LogActionParams) {
  try {
    const logEntry = {
      userId,
      action,
      metadata: metadata || {},
      ip: Array.isArray(ip) ? ip[0] : ip || 'unknown',
      userAgent: userAgent || 'unknown',
      timestamp: new Date().toISOString(),
    };
    
    console.log('AUDIT_LOG:', JSON.stringify(logEntry));
  } catch (error) {
    console.error('Failed to log action:', error);
    // Don't throw to avoid breaking the main functionality
  }
}
