"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.middleware = middleware;
// middleware/admin.ts
const server_1 = require("next/server");
const jwt_1 = require("next-auth/jwt");
async function middleware(request) {
    const token = await (0, jwt_1.getToken)({ req: request });
    const { pathname } = request.nextUrl;
    // Redirect to login if not authenticated
    if (!token) {
        return server_1.NextResponse.redirect(new URL('/login', request.url));
    }
    // Check if user is admin
    if (pathname.startsWith('/admin') && !token.isAdmin) {
        return server_1.NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return server_1.NextResponse.next();
}
// Configure which routes to protect
exports.config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
