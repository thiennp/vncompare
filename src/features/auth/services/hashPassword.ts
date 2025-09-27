// Password hashing function
export function hashPassword(password: string): string {
  // Simple hash for browser compatibility (in production, use proper hashing)
  return btoa(password + 'salt');
}
