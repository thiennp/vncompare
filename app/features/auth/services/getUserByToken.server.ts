// Get user by auth_token cookie
import { verifyJWT } from './verifyJWT';
import { db } from '../../shared/services/database.server';

export async function getUserByToken(request: Request) {
  try {
    // Get auth token from cookies
    const cookieHeader = request.headers.get('Cookie');
    const token = cookieHeader
      ?.split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];

    if (!token) {
      console.log('❌ getUserByToken - No auth token found');
      return null;
    }

    // Verify JWT token
    let decoded: Record<string, unknown>;
    try {
      decoded = await verifyJWT(token);
    } catch (error) {
      console.log('❌ getUserByToken - Invalid token:', error);
      return null;
    }

    const userId = decoded.userId as string;
    if (!userId) {
      console.log('❌ getUserByToken - No userId in token');
      return null;
    }

    // Get full user data from database
    const user = await db.findUserByEmail(decoded.email as string);
    if (!user) {
      console.log('❌ getUserByToken - User not found in database');
      return null;
    }

    console.log('✅ getUserByToken - User found:', user.email);
    return user;
  } catch (error) {
    console.error('❌ getUserByToken - Error:', error);
    return null;
  }
}
