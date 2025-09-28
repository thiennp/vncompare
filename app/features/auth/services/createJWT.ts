// JWT creation function using jose library
import { SignJWT } from 'jose';

// JWT secret (in production, this should come from environment variables)
const JWT_SECRET = new TextEncoder().encode(
  'your-super-secret-jwt-key-for-development-only'
);

export async function createJWT(
  payload: Record<string, unknown>
): Promise<string> {
  try {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    console.log('🔐 JWT created successfully');
    return jwt;
  } catch (error) {
    console.error('❌ Error creating JWT:', error);
    throw new Error('Failed to create JWT token');
  }
}
