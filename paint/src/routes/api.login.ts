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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Authentication error:', error);
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
