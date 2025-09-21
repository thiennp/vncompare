import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // Handle admin subdomain
  if (hostname === 'admin.vncompare.com') {
    // If accessing admin subdomain root, serve the backoffice index
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/backoffice/browser/index.html', request.url))
    }
    
    // Handle all other paths under admin subdomain - rewrite to backoffice assets
    if (pathname.startsWith('/')) {
      // Remove leading slash and rewrite to backoffice browser directory
      const assetPath = pathname.startsWith('/') ? pathname.substring(1) : pathname
      return NextResponse.rewrite(new URL(`/backoffice/browser/${assetPath}`, request.url))
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
