import React, { useState, useEffect } from 'react';
import { Link, useFetcher, type ActionFunctionArgs } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { MongoClient } from 'mongodb';
import { comparePassword } from '../features/auth/services/comparePassword';
import { createJWT } from '../features/auth/services/createJWT';
import { Button } from '../features/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../features/shared/components/ui/card';
import { Input } from '../features/shared/components/ui/input';
import { Label } from '../features/shared/components/ui/label';

const MONGODB_URI = 'mongodb://localhost:27017/vncompare';

// eslint-disable-next-line react-refresh/only-export-components
export async function action({
  request,
}: ActionFunctionArgs): Promise<unknown> {
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
    const token = await createJWT({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    await client.close();

    // Set cookie server-side and redirect
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
    );

    return redirect('/dashboard', {
      headers,
    });
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Đăng nhập thất bại' };
  }
}

export default function Login({
  actionData,
}: {
  actionData?: {
    success: false;
    error: string;
  };
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const fetcher = useFetcher();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Form submitted via fetcher.Form');
  };

  useEffect(() => {
    if (actionData && !actionData.success) {
      setError(actionData.error || 'Đăng nhập thất bại');
    }
  }, [actionData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Đăng nhập vào tài khoản của bạn để tiếp tục
          </CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form
            method="post"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={fetcher.state === 'submitting'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                defaultValue={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={fetcher.state === 'submitting'}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={fetcher.state === 'submitting'}
            >
              {fetcher.state === 'submitting'
                ? 'Đang đăng nhập...'
                : 'Đăng nhập'}
            </Button>
          </fetcher.Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
