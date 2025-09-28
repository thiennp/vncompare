import type { ActionFunctionArgs } from 'react-router-dom';
import { MongoClient } from 'mongodb';
import { comparePassword } from '../services/comparePassword';
import { createJWT } from '../services/createJWT';

const MONGODB_URI = 'mongodb://localhost:27017/vncompare';

export async function loginAction({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    throw new Response('Method not allowed', { status: 405 });
  }

  const formData = await request.formData();
  const { email, password } = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

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
