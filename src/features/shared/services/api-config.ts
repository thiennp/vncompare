// API configuration utility
// Get API base URL at runtime to avoid build-time optimization
function getApiBaseUrl(): string {
  // Check for explicit env variable first
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl;
  }

  // Runtime check - cannot be optimized away by Vite
  if (typeof window !== 'undefined') {
    const hostname = window['location']['hostname'];
    const isProduction =
      hostname === 'vncompare.com' ||
      hostname === 'www.vncompare.com' ||
      hostname.indexOf('vercel.app') !== -1;

    if (isProduction) {
      return '/api';
    }
  }

  return 'http://localhost:3001/api';
}

export const API_BASE_URL = getApiBaseUrl();
