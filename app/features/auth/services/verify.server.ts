// Verify JWT token - direct database connection
import { MongoClient, ObjectId } from 'mongodb';
import { verifyJWT } from './verifyJWT';

const MONGODB_URI = 'mongodb://localhost:27017/vncompare';

export async function verify({ request }: { request: Request }) {
  // Get token from cookies
  const token = request.headers
    .get('cookie')
    ?.split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!token) {
    return new Response(
      JSON.stringify({ success: false, error: 'Không tìm thấy token' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Verify token
    const payload = await verifyJWT(token);
    const userId = payload.userId as string;

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Token không hợp lệ' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('vncompare');

    // Get user from database
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) });
    if (!user) {
      await client.close();
      return new Response(
        JSON.stringify({ success: false, error: 'Không tìm thấy người dùng' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Token verification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Token không hợp lệ' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
