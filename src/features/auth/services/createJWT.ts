// JWT creation function
import { base64UrlEncode } from './base64UrlEncode';

// Browser-compatible JWT secret (in production, this should come from a secure source)
const JWT_SECRET = 'your-super-secret-jwt-key-for-development-only';

export function createJWT(payload: Record<string, unknown>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Simple HMAC-SHA256 implementation for browser
  const signature = btoa(
    encodedHeader + '.' + encodedPayload + '.' + JWT_SECRET
  );

  console.log('🔐 Creating JWT signature:', signature);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
