import type { LoaderFunctionArgs } from 'react-router-dom';
import { MongoClient } from 'mongodb';
import { comparePassword } from '../features/auth/services/comparePassword';
import { createJWT } from '../features/auth/services/createJWT';

const MONGODB_URI = 'mongodb://localhost:27017/vncompare';

export async function login({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const password = url.searchParams.get('password');

  if (!email || !password) {
    return { success: false, error: 'Email và mật khẩu là bắt buộc' };
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('vncompare');

    // Find user
    const user = await db.collection('users').findOne({ email });
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
        _id: user._id,
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
