// Main AuthService class
import { db } from '../../shared/services/api.client';
import { User, RegisterRequest } from '../../shared/types';
import { createJWT } from './createJWT';
import { verifyJWT } from './verifyJWT';
import { hashPassword } from './hashPassword';
import { comparePassword } from './comparePassword';

export class AuthService {
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log('🔐 Attempting login for:', email);

      if (!email || !password) {
        return { success: false, error: 'Email và mật khẩu là bắt buộc' };
      }

      const user = await db.findUserByEmail(email);
      if (!user) {
        console.log('❌ User not found');
        return { success: false, error: 'Email hoặc mật khẩu không đúng' };
      }

      console.log('👤 User found:', user.email);

      // For browser compatibility, we'll use a simple password check
      // In production, this should use proper password hashing
      const isValidPassword = await comparePassword(password, user.password || '');
      if (!isValidPassword) {
        console.log('❌ Invalid password');
        return { success: false, error: 'Email hoặc mật khẩu không đúng' };
      }

      console.log('✅ Password valid');

      // Create JWT token
      const token = createJWT({
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      // Set cookie
      document.cookie = `auth_token=${token}; path=/; max-age=86400; secure; samesite=strict`;

      console.log('✅ Login successful');
      return { success: true, user };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'Đăng nhập thất bại' };
    }
  }

  async register(userData: RegisterRequest): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log('📝 Attempting registration for:', userData.email);

      const { email, password, name, phone } = userData;

      if (!email || !password || !name) {
        return { success: false, error: 'Email, mật khẩu và tên là bắt buộc' };
      }

      // Check if user already exists
      const existingUser = await db.findUserByEmail(email);
      if (existingUser) {
        return { success: false, error: 'Người dùng với email này đã tồn tại' };
      }

      // Hash password
      const hashedPassword = hashPassword(password);

      // Create user
      const newUser = await db.createUser({
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'customer',
      });

      if (!newUser) {
        return { success: false, error: 'Đăng ký thất bại' };
      }

      console.log('✅ Registration successful');
      return { success: true, user: newUser };
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { success: false, error: 'Đăng ký thất bại' };
    }
  }

  async getCurrentUser(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log('🔍 Getting current user...');

      // Get token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (!token) {
        console.log('❌ No token found');
        return { success: false, error: 'Không tìm thấy token' };
      }

      console.log('🔍 Token found, verifying...');

      // Verify token
      const payload = verifyJWT(token);
      const userId = payload.userId as string;

      if (!userId) {
        console.log('❌ No user ID in token');
        return { success: false, error: 'Token không hợp lệ' };
      }

      // Get user from database
      const user = await db.findUserById(userId);
      if (!user) {
        console.log('❌ User not found');
        return { success: false, error: 'Không tìm thấy người dùng' };
      }

      console.log('✅ Current user found:', user.email);
      return { success: true, user };
    } catch (error) {
      console.error('❌ Get current user error:', error);
      return { success: false, error: 'Token không hợp lệ' };
    }
  }

  async logout(): Promise<void> {
    console.log('🚪 Logging out...');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    console.log('✅ Logout successful');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.getCurrentUser();
      if (!result.success || !result.user) {
        return { success: false, error: 'Không tìm thấy người dùng' };
      }

      const user = result.user;
      const isValidPassword = await comparePassword(currentPassword, user.password || '');
      if (!isValidPassword) {
        return { success: false, error: 'Mật khẩu hiện tại không đúng' };
      }

      const hashedPassword = hashPassword(newPassword);
      await db.updateUser(user._id!.toString(), { password: hashedPassword });

      return { success: true };
    } catch (error) {
      console.error('❌ Change password error:', error);
      return { success: false, error: 'Không thể đổi mật khẩu' };
    }
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await db.findUserByEmail(email);
      if (!user) {
        return { success: false, error: 'Email không tồn tại' };
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15);
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      await db.updateUser(user._id!.toString(), {
        resetToken,
        resetTokenExpiry,
      });

      // In a real application, you would send an email here
      console.log('📧 Password reset token:', resetToken);

      return { success: true };
    } catch (error) {
      console.error('❌ Request password reset error:', error);
      return { success: false, error: 'Không thể gửi email đặt lại mật khẩu' };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await db.findUserByEmail(''); // This would need to be implemented properly
      if (!user || user.resetToken !== token) {
        return { success: false, error: 'Token đặt lại mật khẩu không hợp lệ' };
      }

      if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
        return { success: false, error: 'Token đặt lại mật khẩu đã hết hạn' };
      }

      const hashedPassword = hashPassword(newPassword);
      await db.updateUser(user._id!.toString(), {
        password: hashedPassword,
        resetToken: undefined,
        resetTokenExpiry: undefined,
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Reset password error:', error);
      return { success: false, error: 'Không thể đặt lại mật khẩu' };
    }
  }
}