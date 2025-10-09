import { json } from 'react-router-dom';

// Dynamic import to avoid bundling server-side dependencies in client
async function authenticateUser(email: string, password: string) {
  try {
    // Dynamic import of server-side authentication
    const { authenticateUser: serverAuth } = await import('../server/auth');
    return await serverAuth(email, password);
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Đăng nhập thất bại' };
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return json({ success: false, error: 'Email và mật khẩu là bắt buộc' });
  }

  // Use real MongoDB authentication
  const result = await authenticateUser(email, password);
  return json(result);
}
