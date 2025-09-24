import { NextRequest, NextResponse } from 'next/server'
import { createAuthMiddleware } from '@/lib/auth'

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/cart',
  '/orders',
  '/profile',
  '/settings'
];

// Create auth middleware
const authMiddleware = createAuthMiddleware(protectedRoutes);

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // Apply authentication middleware for protected routes
  const authResponse = authMiddleware(request);
  if (authResponse) {
    return authResponse;
  }

  // For main domain, continue with normal routing
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
