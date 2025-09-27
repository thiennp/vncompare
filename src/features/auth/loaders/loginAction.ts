import type { ActionFunctionArgs } from 'react-router-dom';

export async function loginAction({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    throw new Response('Method not allowed', { status: 405 });
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: request.body,
      headers: request.headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login action error:', error);
    return { success: false, error: 'Đăng nhập thất bại' };
  }
}
