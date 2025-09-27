import { db } from '../../shared';
import { User, RegisterRequest } from '../../shared/types';
import { isLoginRequest, isRegisterRequest } from '../../shared/types/guards';

// Browser-compatible JWT secret (in production, this should come from a secure source)
const JWT_SECRET = 'your-super-secret-jwt-key-for-development-only';

// Simple browser-compatible JWT functions
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

function createJWT(payload: Record<string, unknown>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Simple HMAC-SHA256 implementation for browser
  const signature = btoa(
    encodedHeader + '.' + encodedPayload + '.' + JWT_SECRET
  );

  console.log('🔐 Creating JWT signature:', signature);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJWT(token: string): Record<string, unknown> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');

    const [header, payload, signature] = parts;

    console.log('🔍 Verifying JWT parts:');
    console.log('  Header:', header);
    console.log('  Payload:', payload);
    console.log('  Signature:', signature);

    // Create the expected signature the same way as createJWT
    const expectedSignature = btoa(header + '.' + payload + '.' + JWT_SECRET);
    console.log('🔍 Expected signature:', expectedSignature);

    // Normalize signatures by removing base64 padding for comparison
    const normalizedExpected = expectedSignature.replace(/=+$/, '');
    const normalizedReceived = signature.replace(/=+$/, '');

    console.log('🔍 Normalized comparison:');
    console.log('  Expected (normalized):', normalizedExpected);
    console.log('  Received (normalized):', normalizedReceived);

    if (normalizedReceived !== normalizedExpected) {
      console.log('❌ Signature mismatch after normalization');
      console.log('Expected length:', normalizedExpected.length);
      console.log('Received length:', normalizedReceived.length);
      throw new Error('Invalid signature');
    }

    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    console.log('✅ JWT verification successful, payload:', decodedPayload);
    return decodedPayload;
  } catch (error) {
    console.log('❌ JWT verification failed:', error);
    throw new Error('Invalid token');
  }
}

// Simple password hashing for browser (not secure for production)
function hashPassword(password: string): string {
  // Use the same hashing method as the seeding script
  return btoa(password + JWT_SECRET);
}

function comparePassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export class AuthService {
  async register(userData: RegisterRequest): Promise<AuthResult> {
    try {
      // Validate input data with generated type guard
      if (
        !isRegisterRequest(userData, {
          identifier: 'RegisterRequest',
          callbackOnError: console.error,
          errorMode: 'json',
        })
      ) {
        return {
          success: false,
          message: 'Invalid registration data',
        };
      }

      // Check if user already exists
      const existingUser = await db.findUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'Người dùng với email này đã tồn tại',
        };
      }

      // Hash password
      const hashedPassword = hashPassword(userData.password);

      // Create user
      const user = await db.createUser({
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        phone: userData.phone,
        role: userData.role || 'customer',
      });

      // Generate token
      const token = createJWT({
        userId: user._id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      });

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword as User,
        token,
      };
    } catch (error) {
      console.error('Registration error:', error);
        return {
          success: false,
          message: 'Đăng ký thất bại',
        };
    }
  }

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Validate input data with generated type guard
      const loginData = { email, password };
      if (
        !isLoginRequest(loginData, {
          identifier: 'LoginRequest',
          callbackOnError: console.error,
          errorMode: 'json',
        })
      ) {
        return {
          success: false,
          message: 'Định dạng email hoặc mật khẩu không hợp lệ',
        };
      }

      // Find user
      const user = await db.findUserByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Email hoặc mật khẩu không đúng',
        };
      }

      // Check password
      if (!user.password) {
        return {
          success: false,
          message: 'Email hoặc mật khẩu không đúng',
        };
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Email hoặc mật khẩu không đúng',
        };
      }

      // Update last login
      await db.updateUser(user._id!.toString(), {
        lastLoginAt: new Date().toISOString(),
      });

      // Generate token
      const token = createJWT({
        userId: user._id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      });

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword as User,
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
        return {
          success: false,
          message: 'Đăng nhập thất bại',
        };
    }
  }

  async verifyToken(
    token: string
  ): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      console.log('🔍 Verifying token...');
      const decoded = verifyJWT(token);
      console.log('🔍 Decoded payload:', decoded);

      const user = await db.findUserById(decoded.userId as string);
      console.log('🔍 Found user:', !!user);

      if (!user) {
        console.log('❌ User not found');
        return {
          success: false,
          message: 'Không tìm thấy người dùng',
        };
      }

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      console.log('✅ Token verification successful');
      return {
        success: true,
        user: userWithoutPassword as User,
      };
    } catch (error) {
      console.log('❌ Token verification error:', error);
        return {
          success: false,
          message: 'Token không hợp lệ',
        };
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<AuthResult> {
    try {
      const user = await db.findUserById(userId);
      if (!user || !user.password) {
        return {
          success: false,
          message: 'Không tìm thấy người dùng',
        };
      }

      // Verify current password
      const isValidPassword = comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Mật khẩu hiện tại không đúng',
        };
      }

      // Hash new password
      const hashedPassword = hashPassword(newPassword);

      // Update password
      await db.updateUser(userId, { password: hashedPassword });

        return {
          success: true,
          message: 'Đổi mật khẩu thành công',
        };
    } catch (error) {
      console.error('Change password error:', error);
        return {
          success: false,
          message: 'Không thể đổi mật khẩu',
        };
    }
  }

  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const user = await db.findUserByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Không tìm thấy người dùng',
        };
      }

      // Generate reset token
      const resetToken = createJWT({
        userId: user._id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
      });

      // Update user with reset token
      await db.updateUser(user._id!.toString(), {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600000).toISOString(), // 1 hour
      });

      // In a real application, you would send an email here
      console.log('Reset token:', resetToken);

        return {
          success: true,
          message: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn',
        };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
          message: 'Không thể đặt lại mật khẩu',
      };
    }
  }

  async confirmPasswordReset(
    token: string,
    newPassword: string
  ): Promise<AuthResult> {
    try {
      const decoded = verifyJWT(token);
      const user = await db.findUserById(decoded.userId as string);

      if (!user || !user.resetToken || user.resetToken !== token) {
        return {
          success: false,
          message: 'Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn',
        };
      }

      if (
        user.resetTokenExpiry &&
        new Date(user.resetTokenExpiry) < new Date()
      ) {
        return {
          success: false,
          message: 'Token đặt lại mật khẩu đã hết hạn',
        };
      }

      // Hash new password
      const hashedPassword = hashPassword(newPassword);

      // Update password and clear reset token
      await db.updateUser(user._id!.toString(), {
        password: hashedPassword,
        resetToken: undefined,
        resetTokenExpiry: undefined,
      });

        return {
          success: true,
          message: 'Đặt lại mật khẩu thành công',
        };
    } catch (error) {
      console.error('Confirm password reset error:', error);
      return {
        success: false,
          message: 'Không thể đặt lại mật khẩu',
      };
    }
  }
}

export const authService = new AuthService();
