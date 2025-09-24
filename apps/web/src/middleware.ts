import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // For now, skip auth middleware in edge runtime due to JWT compatibility issues
  // TODO: Implement edge-compatible auth or move to API routes
  
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
