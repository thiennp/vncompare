// Orders page loader
export async function ordersLoader({ request }: { request: Request }) {
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
    
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    
    return {
      orders: [],
      total: 0,
      status,
      page,
    };
  } catch (error) {
    throw new Response('Unauthorized', { status: 401 });
  }
}
