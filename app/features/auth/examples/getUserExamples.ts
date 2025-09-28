// Examples of how to get user by auth_token cookie
import { getUserByToken } from '../services/getUserByToken.server';
import { getUserIdFromToken } from '../services/getUserIdFromToken.server';
import { verifyJWT } from '../services/verifyJWT';

// Example 1: Get full user data (with database lookup)
export async function exampleGetFullUser(request: Request) {
  const user = await getUserByToken(request);

  if (!user) {
    // User not authenticated or token invalid
    return { success: false, error: 'Not authenticated' };
  }

  return {
    success: true,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
}

// Example 2: Get only user ID (no database lookup)
export async function exampleGetUserId(request: Request) {
  const userId = await getUserIdFromToken(request);

  if (!userId) {
    return { success: false, error: 'Not authenticated' };
  }

  return {
    success: true,
    userId,
  };
}

// Example 3: Manual token extraction and verification
export async function exampleManualTokenHandling(request: Request) {
  // Extract token from cookies
  const cookieHeader = request.headers.get('Cookie');
  const token = cookieHeader
    ?.split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!token) {
    return { success: false, error: 'No token found' };
  }

  try {
    // Verify token
    const decoded = await verifyJWT(token);

    return {
      success: true,
      payload: decoded,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid token',
    };
  }
}

// Example 4: Usage in a loader function
export async function exampleLoaderUsage({ request }: { request: Request }) {
  const user = await getUserByToken(request);

  if (!user) {
    // Redirect to login if not authenticated
    throw new Response(null, {
      status: 302,
      headers: { Location: '/login' },
    });
  }

  // Return data with user context
  return {
    user,
    // ... other data
  };
}
