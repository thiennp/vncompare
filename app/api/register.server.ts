// Register user - direct database connection
import { MongoClient } from 'mongodb';
import { hashPassword } from '../features/auth/services/hashPassword';

const MONGODB_URI = 'mongodb://localhost:27017/vncompare';

export async function register({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    throw new Response('Method not allowed', { status: 405 });
  }

  const formData = await request.formData();
  const userData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
  };

  if (!userData.email || !userData.password || !userData.name) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Email, mật khẩu và tên là bắt buộc',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('vncompare');

    // Check if user already exists
    const existingUser = await db
      .collection('users')
      .findOne({ email: userData.email });
    if (existingUser) {
      await client.close();
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Người dùng với email này đã tồn tại',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Hash password
    const hashedPassword = hashPassword(userData.password);

    // Create user
    const result = await db.collection('users').insertOne({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      phone: userData.phone,
      role: 'customer',
      createdAt: new Date(),
    });

    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          _id: result.insertedId,
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          role: 'customer',
        },
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Đăng ký thất bại' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
