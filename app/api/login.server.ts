import type { ActionFunctionArgs } from 'react-router-dom';
import { MongoClient } from 'mongodb';
import { comparePassword } from '../features/auth/services/comparePassword';
import { createJWT } from '../features/auth/services/createJWT';
import { User } from '@/features/shared/types';

const MONGODB_URI = 'mongodb://localhost:27017/vncompare';

export interface LoginSuccessResponse {
  readonly success: true;
  readonly user: Pick<User, 'email' | 'name' | 'role'>;
  readonly token: string;
}

export interface LoginErrorResponse {
  readonly success: false;
  readonly error: string;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export async function action({ request }: ActionFunctionArgs): Promise<LoginResponse> {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email và mật khẩu là bắt buộc' };
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('vncompare');

    // Find user
    const user = await db.collection('users').findOne({ email: email });
    if (!user) {
      await client.close();
      return { success: false, error: 'Email hoặc mật khẩu không đúng' };
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      await client.close();
      return { success: false, error: 'Email hoặc mật khẩu không đúng' };
    }

    // Create JWT token
    const token = createJWT({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    await client.close();

    return {
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Đăng nhập thất bại' };
  }
}
