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
    // For client-side, we'll use a simple token check
    const response = await fetch('/api/verify', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.user) {
        console.log('✅ Auth check - User found:', result.user.email);
        return result.user;
      }
    }
    
    console.log('❌ Auth check - No user found');
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
