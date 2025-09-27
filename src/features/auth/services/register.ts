// Register user function
import { User, RegisterRequest } from '../../shared/types';
import { hashPassword } from './hashPassword';
import { findUserByEmail } from '../utils/findUserByEmail.server';
import { getDatabase } from '../utils/getDatabase.server';

async function createUser(userData: RegisterRequest): Promise<User | null> {
  try {
    const db = await getDatabase();
    const result = await db.collection('users').insertOne(userData);
    return {
      ...userData, 
      _id: result.insertedId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as User;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function register(userData: RegisterRequest): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    console.log('📝 Attempting registration for:', userData.email);

    const { email, password, name, phone } = userData;

    if (!email || !password || !name) {
      return { success: false, error: 'Email, mật khẩu và tên là bắt buộc' };
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'Người dùng với email này đã tồn tại' };
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create user
    const newUser = await createUser({
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
