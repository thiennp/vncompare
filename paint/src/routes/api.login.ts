import { json } from 'react-router-dom';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const MONGODB_URI = 'mongodb://localhost:27017/vncompare';
const JWT_SECRET = 'your-secret-key';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return json({ success: false, error: 'Email và mật khẩu là bắt buộc' });
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('vncompare');

    // Find user
    const user = await db.collection('users').findOne({ email: email });
    if (!user) {
      await client.close();
      return json({ success: false, error: 'Email hoặc mật khẩu không đúng' });
    }

    // Check password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      await client.close();
      return json({ success: false, error: 'Email hoặc mật khẩu không đúng' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await client.close();

    return json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return json({ success: false, error: 'Đăng nhập thất bại' });
  }
}
