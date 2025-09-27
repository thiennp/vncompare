// Cookie-based authentication service with database integration
import Cookies from 'js-cookie';
import { db } from './database.client';
import md5 from 'md5';

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  createdAt: string;
  isActive?: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// Browser-compatible JWT secret
const JWT_SECRET = 'your-super-secret-jwt-key-for-development-only';

// MD5 password hashing using md5 library
function hashPassword(password: string): string {
  return md5(password);
}

function comparePassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Simple JWT functions
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
  const signature = base64UrlEncode(JWT_SECRET);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJWT(token: string): Record<string, unknown> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const [, payload, signature] = parts;
    const expectedSignature = base64UrlEncode(JWT_SECRET);
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }
    
    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    
    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }
    
    return decodedPayload;
  } catch (error) {
    console.log('❌ JWT verification failed:', error);
    throw new Error('Invalid token');
  }
}

export class CookieAuthService {
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('🔐 Cookie auth: Attempting login for:', email);
      
      // Find user in database
      const user = await db.findUserByEmail(email);
      if (!user) {
        console.log('❌ User not found:', email);
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Check password
      if (!user.password) {
        console.log('❌ No password set for user:', email);
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        console.log('❌ Invalid password for user:', email);
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

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

      console.log('✅ Cookie auth: Login successful for:', email);
      return {
        success: true,
        user: userWithoutPassword as User,
        token,
      };
    } catch (error) {
      console.error('❌ Cookie auth: Login error:', error);
      return {
        success: false,
        message: 'Login failed',
      };
    }
  }

  async register(userData: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
  }): Promise<AuthResult> {
    try {
      console.log('🔐 Cookie auth: Attempting registration for:', userData.email);
      
      // Check if user already exists
      const existingUser = await db.findUserByEmail(userData.email);
      if (existingUser) {
        console.log('❌ User already exists:', userData.email);
        return {
          success: false,
          message: 'User with this email already exists',
        };
      }

      // Hash password
      const hashedPassword = hashPassword(userData.password);

      // Create user in database
      const newUser = await db.createUser({
        email: userData.email,
        password: hashedPassword,
        name: userData.name || '',
        phone: userData.phone || '',
        role: 'customer',
      });

      // Generate token
      const token = createJWT({
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      console.log('✅ Cookie auth: Registration successful for:', userData.email);
      return {
        success: true,
        user: userWithoutPassword as User,
        token,
      };
    } catch (error) {
      console.error('❌ Cookie auth: Registration error:', error);
      return {
        success: false,
        message: 'Registration failed',
      };
    }
  }

  async verifyToken(token: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      console.log('🔐 Cookie auth: Verifying token');
      const payload = verifyJWT(token);
      
      // Find user in database
      const user = await db.findUserByEmail(payload.email as string);
      if (!user) {
        console.log('❌ Cookie auth: User not found for token');
        return { success: false, message: 'User not found' };
      }

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      console.log('✅ Cookie auth: Token verified for:', user.email);
      return {
        success: true,
        user: userWithoutPassword as User,
      };
    } catch (error) {
      console.log('❌ Cookie auth: Token verification failed:', error);
      return { success: false, message: 'Invalid token' };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = Cookies.get('auth_token');
    if (!token) return null;

    try {
      const payload = verifyJWT(token);
      const user = await db.findUserByEmail(payload.email as string);
      if (!user) return null;

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      console.log('❌ Cookie auth: Error getting current user:', error);
      return null;
    }
  }

  logout(): void {
    console.log('🔐 Cookie auth: Logging out');
    Cookies.remove('auth_token');
  }
}

export const cookieAuthService = new CookieAuthService();
