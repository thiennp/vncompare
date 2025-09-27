// Secure server-side authentication service
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './database.server';

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

// Get JWT secret from environment (should be set on server)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

// Secure password hashing with bcrypt
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // High security
  return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Secure JWT token generation
function createJWT(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // 7 days
    issuer: 'vncompare',
    audience: 'vncompare-users'
  });
}

// Secure JWT token verification
function verifyJWT(token: string): { userId: string; email: string; role: string } {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'vncompare',
    audience: 'vncompare-users'
  }) as { userId: string; email: string; role: string };
}

export class SecureAuthService {
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('🔐 Secure auth: Attempting login for:', email);
      
      // Find user in database
      const user = await db.findUserByEmail(email);
      if (!user) {
        console.log('❌ User not found:', email);
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Check password with secure bcrypt comparison
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        console.log('❌ Invalid password for user:', email);
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Generate secure JWT token
      const token = createJWT({
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      console.log('✅ Secure auth: Login successful for:', email);
      return {
        success: true,
        user: userWithoutPassword as User,
        token,
      };
    } catch (error) {
      console.error('❌ Secure auth: Login error:', error);
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
      console.log('🔐 Secure auth: Attempting registration for:', userData.email);
      
      // Check if user already exists
      const existingUser = await db.findUserByEmail(userData.email);
      if (existingUser) {
        console.log('❌ User already exists:', userData.email);
        return {
          success: false,
          message: 'User with this email already exists',
        };
      }

      // Hash password with secure bcrypt
      const hashedPassword = await hashPassword(userData.password);

      // Create user in database
      const newUser = await db.createUser({
        email: userData.email,
        password: hashedPassword,
        name: userData.name || '',
        phone: userData.phone || '',
        role: 'customer',
      });

      // Generate secure JWT token
      const token = createJWT({
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      });

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = newUser;

      console.log('✅ Secure auth: Registration successful for:', userData.email);
      return {
        success: true,
        user: userWithoutPassword as User,
        token,
      };
    } catch (error) {
      console.error('❌ Secure auth: Registration error:', error);
      return {
        success: false,
        message: 'Registration failed',
      };
    }
  }

  async verifyToken(token: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      console.log('🔐 Secure auth: Verifying token');
      const payload = verifyJWT(token);
      
      // Find user in database
      const user = await db.findUserByEmail(payload.email);
      if (!user) {
        console.log('❌ Secure auth: User not found for token');
        return { success: false, message: 'User not found' };
      }

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      console.log('✅ Secure auth: Token verified for:', user.email);
      return {
        success: true,
        user: userWithoutPassword as User,
      };
    } catch (error) {
      console.log('❌ Secure auth: Token verification failed:', error);
      return { success: false, message: 'Invalid token' };
    }
  }
}

export const secureAuthService = new SecureAuthService();
