// Client-side mock API for browser compatibility
// In a real SSR application, this would be handled server-side

export interface LoginSuccessResponse {
  readonly success: true;
  readonly user: {
    email: string;
    name: string;
    role: string;
  };
  readonly token: string;
}

export interface LoginErrorResponse {
  readonly success: false;
  readonly error: string;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  if (!email || !password) {
    return { success: false, error: 'Email và mật khẩu là bắt buộc' };
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock authentication with seeded users
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
    return {
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token: 'mock-jwt-token-' + Date.now(),
    };
  }

  return { success: false, error: 'Email hoặc mật khẩu không đúng' };
}
