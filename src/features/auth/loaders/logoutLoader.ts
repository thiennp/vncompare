// Logout user loader
export async function logoutLoader({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    throw new Response('Method not allowed', { status: 405 });
  }

  try {
    // Clear the auth token cookie
    return new Response(JSON.stringify({ success: true, message: 'Đăng xuất thành công' }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Set-Cookie': 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Đăng xuất thất bại' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
