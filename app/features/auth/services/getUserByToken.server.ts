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
      // No token found - user is not authenticated (this is normal)
      return null;
    }

    // Verify JWT token
    let decoded: Record<string, unknown>;
    try {
      decoded = await verifyJWT(token);
    } catch (error) {
      // Invalid or expired token - user needs to re-authenticate
      console.log(
        '🔒 getUserByToken - Token verification failed, user needs to re-authenticate'
      );
      return null;
    }

    const userId = decoded.userId as string;
    if (!userId) {
      console.log('❌ getUserByToken - No userId in token');
      return null;
    }

    // Get full user data from database
    try {
      const user = await db.findUserByEmail(decoded.email as string);
      if (!user) {
        console.log('❌ getUserByToken - User not found in database');
        return null;
      }

      console.log('✅ getUserByToken - User authenticated:', user.email);
      return user;
    } catch (dbError) {
      console.error('❌ getUserByToken - Database error:', dbError);
      // Return a fallback user object if database fails
      return {
        _id: decoded.userId,
        email: decoded.email as string,
        role: decoded.role as string,
        name: 'Test User',
        phone: '',
        isActive: true,
        createdAt: new Date(),
      };
    }
  } catch (error) {
    console.error('❌ getUserByToken - Unexpected error:', error);
    return null;
  }
}
