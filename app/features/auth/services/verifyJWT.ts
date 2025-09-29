// JWT verification function using jose library
import { jwtVerify } from 'jose';

// JWT secret (in production, this should come from environment variables)
const JWT_SECRET = new TextEncoder().encode(
  'your-super-secret-jwt-key-for-development-only'
);

export async function verifyJWT(
  token: string
): Promise<Record<string, unknown>> {
  try {
    console.log('🔍 Verifying JWT token');

    const { payload } = await jwtVerify(token, JWT_SECRET);

    console.log('✅ JWT signature verified');
    console.log('📄 Decoded payload:', payload);

    return payload as Record<string, unknown>;
  } catch (error) {
    console.log('❌ JWT verification failed - Invalid or expired token');
    throw new Error('Invalid token');
  }
}
