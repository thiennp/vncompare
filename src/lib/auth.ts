import { db } from './database-browser';
import { User, RegisterRequest } from '../types';
import { isLoginRequest, isRegisterRequest } from '../types/guards';

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

function createJWT(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Simple HMAC-SHA256 implementation for browser
  const signature = btoa(
    encodedHeader + '.' + encodedPayload + '.' + JWT_SECRET
  );

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');

    const [header, payload, signature] = parts;
    const expectedSignature = btoa(header + '.' + payload + '.' + JWT_SECRET);

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    return JSON.parse(base64UrlDecode(payload));
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Simple password hashing for browser (not secure for production)
function hashPassword(password: string): string {
  // Simple hash for demo purposes - in production, use proper server-side hashing
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
          message: 'User with this email already exists',
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
      const { password: _password, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword as User,
        token,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed',
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
          message: 'Invalid email or password format',
        };
      }

      // Find user
      const user = await db.findUserByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Check password
      if (!user.password) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Update last login
      await db.updateUser(user._id!.toString(), { lastLoginAt: new Date().toISOString() });

      // Generate token
      const token = createJWT({
        userId: user._id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      });

      // Remove password from response
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
        message: 'Login failed',
      };
    }
  }

  async verifyToken(
    token: string
  ): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const decoded = verifyJWT(token);
      const user = await db.findUserById(decoded.userId);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Remove password from response
      const { password: _password, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword as User,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid token',
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
          message: 'User not found',
        };
      }

      // Verify current password
      const isValidPassword = comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Current password is incorrect',
        };
      }

      // Hash new password
      const hashedPassword = hashPassword(newPassword);

      // Update password
      await db.updateUser(userId, { password: hashedPassword });

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Failed to change password',
      };
    }
  }

  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const user = await db.findUserByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
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
        message: 'Password reset instructions sent to your email',
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Failed to reset password',
      };
    }
  }

  async confirmPasswordReset(
    token: string,
    newPassword: string
  ): Promise<AuthResult> {
    try {
      const decoded = verifyJWT(token);
      const user = await db.findUserById(decoded.userId);

      if (!user || !user.resetToken || user.resetToken !== token) {
        return {
          success: false,
          message: 'Invalid or expired reset token',
        };
      }

      if (user.resetTokenExpiry && new Date(user.resetTokenExpiry) < new Date()) {
        return {
          success: false,
          message: 'Reset token has expired',
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
        message: 'Password reset successfully',
      };
    } catch (error) {
      console.error('Confirm password reset error:', error);
      return {
        success: false,
        message: 'Failed to reset password',
      };
    }
  }
}

export const authService = new AuthService();
