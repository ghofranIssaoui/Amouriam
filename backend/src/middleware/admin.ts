// middleware/admin.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Redirect to login if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check if user is admin
  if (pathname.startsWith('/admin') && !token.isAdmin) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};