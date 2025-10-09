import { json } from 'react-router-dom';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return json({ success: false, error: 'Email và mật khẩu là bắt buộc' });
  }

  // For now, use mock authentication to avoid browser compatibility issues
  // In a real production app, this would be handled by a separate API server
  const mockUsers = [
    {
      email: 'admin@paint.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
    },
    {
      email: 'user@paint.com',
      password: 'user123',
      name: 'Regular User',
      role: 'user',
    },
    {
      email: 'test@example.com',
      password: 'test123',
      name: 'Test User',
      role: 'user',
    },
  ];

  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    return json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token: 'mock-jwt-token-' + Date.now(),
    });
  }

  return json({ success: false, error: 'Email hoặc mật khẩu không đúng' });
}
