// Get user ID from auth_token cookie without database lookup
import { verifyJWT } from './verifyJWT';

export async function getUserIdFromToken(
  request: Request
): Promise<string | null> {
  try {
    // Get auth token from cookies
    const cookieHeader = request.headers.get('Cookie');
    const token = cookieHeader
      ?.split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];

    if (!token) {
      console.log('❌ getUserIdFromToken - No auth token found');
      return null;
    }

    // Verify JWT token
    let decoded: Record<string, unknown>;
    try {
      decoded = await verifyJWT(token);
    } catch (error) {
      console.log('❌ getUserIdFromToken - Invalid token:', error);
      return null;
    }

    const userId = decoded.userId as string;
    if (!userId) {
      console.log('❌ getUserIdFromToken - No userId in token');
      return null;
    }

    console.log('✅ getUserIdFromToken - User ID found:', userId);
    return userId;
  } catch (error) {
    console.error('❌ getUserIdFromToken - Error:', error);
    return null;
  }
}
