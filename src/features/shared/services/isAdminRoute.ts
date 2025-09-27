// Check if route is admin route
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin');
}
