import { API_BASE_URL } from '../features/shared/services/api-config';

// Call external API server for authentication
async function authenticateUser(email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      return { success: false, error: 'Đăng nhập thất bại' };
    }

    const result = await response.json();
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
    return { success: false, error: 'Email và mật khẩu là bắt buộc' };
  }

  // Use external API server for authentication
  const result = await authenticateUser(email, password);
  return result;
}
