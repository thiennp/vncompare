// API configuration utility
// In production, use relative URLs to hit the same domain's /api routes
// In development, use localhost:3001
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'vncompare.com' ||
    window.location.hostname === 'www.vncompare.com' ||
    window.location.hostname.includes('vercel.app'))
    ? '/api'
    : 'http://localhost:3001/api');
