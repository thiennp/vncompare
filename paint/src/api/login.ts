// Mock API for client-side demo
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

  // Mock authentication - accept any email/password for demo
  if (email && password) {
    return {
      success: true,
      user: {
        email: email,
        name: email.split('@')[0] || 'User', // Use email prefix as name
        role: 'user',
      },
      token: 'mock-jwt-token-' + Date.now(),
    };
  }

  return { success: false, error: 'Email hoặc mật khẩu không đúng' };
}
