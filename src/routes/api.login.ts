import { json } from 'react-router-dom';

// Call external API server for authentication
async function authenticateUser(email: string, password: string) {
  try {
    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    // If response is not ok, return the error from the server
    if (!response.ok) {
      return { success: false, error: result.error || 'Đăng nhập thất bại' };
    }

    return result;
  } catch (error) {
    console.error('Authentication error:', error);
    // Only show connection error for actual network issues
    return { success: false, error: 'Không thể kết nối đến server' };
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return json({ success: false, error: 'Email và mật khẩu là bắt buộc' });
  }

  // Use external API server for authentication
  const result = await authenticateUser(email, password);
  return json(result);
}
