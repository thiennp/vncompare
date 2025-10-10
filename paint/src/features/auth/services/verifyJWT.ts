// JWT verification function
import { base64UrlDecode } from './base64UrlDecode';

// Browser-compatible JWT secret (in production, this should come from a secure source)
const JWT_SECRET = 'your-super-secret-jwt-key-for-development-only';

export function verifyJWT(token: string): Record<string, unknown> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');

    const [header, payload, signature] = parts;

    console.log('🔍 Verifying JWT parts:');
    console.log('  Header:', header);
    console.log('  Payload:', payload);
    console.log('  Signature:', signature);

    // Create the expected signature the same way as createJWT
    const expectedSignature = btoa(header + '.' + payload + '.' + JWT_SECRET);
    console.log('🔍 Expected signature:', expectedSignature);

    if (signature !== expectedSignature) {
      console.log('❌ Signature mismatch');
      throw new Error('Invalid signature');
    }

    console.log('✅ JWT signature verified');
    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    console.log('📄 Decoded payload:', decodedPayload);

    return decodedPayload;
  } catch (error) {
    console.error('❌ JWT verification failed:', error);
    throw new Error('Token không hợp lệ');
  }
}
