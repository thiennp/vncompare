// Check if route is auth route
export function isAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname === '/register';
}
