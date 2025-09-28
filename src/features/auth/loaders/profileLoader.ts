import { verifyJWT } from '../services/verifyJWT';

// Profile page loader
export async function profileLoader() {
  // Get token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
  }

  try {
    // Verify JWT token directly
    const decoded = verifyJWT(token);
    if (decoded && decoded.userId) {
      return {
        user: {
          _id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        },
      };
    }

    throw new Response('Unauthorized', { status: 401 });
  } catch (error) {
    throw new Response('Unauthorized', { status: 401 });
  }
}
