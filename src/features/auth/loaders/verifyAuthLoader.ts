import { verifyJWT } from '../services/verifyJWT';

// Shared auth verification loader
export async function verifyAuth() {
  // Get token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  console.log('🔍 Auth check - Token exists:', !!token);
  console.log('🔍 Auth check - All cookies:', document.cookie);

  if (!token) {
    console.log('❌ Auth check - No token found');
    return null;
  }

  try {
    // Verify JWT token directly
    const decoded = verifyJWT(token);
    if (decoded && decoded.userId) {
      console.log('✅ Auth check - User found:', decoded.email);
      return {
        _id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }

    console.log('❌ Auth check - Invalid token');
    return null;
  } catch (error) {
    console.log('❌ Auth check - Error:', error);
    return null;
  }
}

// Helper function to verify admin access
export async function verifyAdmin() {
  const user = await verifyAuth();
  if (!user || user.role !== 'admin') {
    throw new Response('Unauthorized', { status: 401 });
  }
  return user;
}
