import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    return {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name || '',
      role: decoded.role,
      createdAt: decoded.createdAt || new Date().toISOString(),
      lastLoginAt: decoded.lastLoginAt
    };
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function createAuthMiddleware(protectedRoutes: string[] = []) {
  return function authMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    if (!isProtectedRoute) {
      return NextResponse.next();
    }
    
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Add user to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id.toString());
    requestHeaders.set('x-user-email', user.email);
    requestHeaders.set('x-user-role', user.role);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  };
}

export function requireAuth(handler: Function) {
  return async function(request: NextRequest, ...args: any[]) {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Add user to request context
    (request as any).user = user;
    
    return handler(request, ...args);
  };
}

export function requireRole(roles: string[]) {
  return function(handler: Function) {
    return async function(request: NextRequest, ...args: any[]) {
      const user = (request as any).user;
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        );
      }
      
      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { success: false, message: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      return handler(request, ...args);
    };
  };
}
