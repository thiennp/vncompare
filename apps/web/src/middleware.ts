import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // Handle admin subdomain
  if (hostname === 'admin.vncompare.com') {
    // If accessing admin subdomain, serve the backoffice
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/backoffice/browser/index.html', request.url))
    }
    
    // Handle all other paths under admin subdomain
    if (pathname.startsWith('/')) {
      return NextResponse.rewrite(new URL(`/backoffice/browser${pathname}`, request.url))
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
