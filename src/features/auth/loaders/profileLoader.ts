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
    const response = await fetch('/api/verify', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.user) {
        return { user: result.user };
      }
    }
    
    throw new Response('Unauthorized', { status: 401 });
  } catch (error) {
    throw new Response('Unauthorized', { status: 401 });
  }
}
