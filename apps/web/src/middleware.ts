import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // Check if the request is for a protected route
  const protectedRoutes = ['/admin', '/dashboard', '/profile', '/orders']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Check for authentication token
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      // Redirect to login page
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // In a real application, you would verify the JWT token here
    // For now, we'll just check if the token exists
    try {
      // Basic token validation (in production, use a proper JWT library)
      if (token.length < 10) {
        throw new Error('Invalid token')
      }
    } catch (error) {
      // Token is invalid, redirect to login
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
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
