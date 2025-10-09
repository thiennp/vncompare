import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function verifyJWT(token: string): Record<string, unknown> {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
