// Dashboard page loader
export async function dashboardLoader() {
  // Get token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
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
        return {
          user: result.user,
          recentOrders: [],
          addresses: [],
        };
      }
    }
    
    throw new Response('Unauthorized', { status: 401 });
  } catch (error) {
    throw new Response('Unauthorized', { status: 401 });
  }
}
