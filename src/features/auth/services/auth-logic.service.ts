// Authentication business logic service
import { User } from '../../shared/types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getCurrentUser: () => Promise<{ success: boolean; user?: User; error?: string }>;
}

export class AuthLogicService {
  // Extract token from cookies
  static getTokenFromCookies(): string | null {
    if (typeof document === 'undefined') return null;
    
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
    
    return token || null;
  }

  // Check if user is authenticated
  static isAuthenticated(user: User | null): boolean {
    return !!user;
  }

  // Check if user is admin
  static isAdmin(user: User | null): boolean {
    return user?.role === 'admin';
  }

  // Check if user is supplier
  static isSupplier(user: User | null): boolean {
    return user?.role === 'supplier';
  }

  // Get user display name
  static getUserDisplayName(user: User | null): string {
    if (!user) return 'Khách';
    return user.name || user.email || 'Người dùng';
  }

  // Get user initials for avatar
  static getUserInitials(user: User | null): string {
    if (!user) return 'K';
    const name = user.name || user.email || '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  // Get user role display name
  static getRoleDisplayName(role: string): string {
    const roleMap: Record<string, string> = {
      admin: 'Quản trị viên',
      supplier: 'Nhà cung cấp',
      customer: 'Khách hàng',
    };
    return roleMap[role] || role;
  }
}
