// Order detail page loader
export async function orderDetailLoader() {
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
    
    if (!response.ok) {
      throw new Response('Unauthorized', { status: 401 });
    }
    
    return {
      order: null,
    };
  } catch (error) {
    throw new Response('Unauthorized', { status: 401 });
  }
}
