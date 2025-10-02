import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useFetcher } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../features/shared/components/ui/card';
import { Button } from '../features/shared/components/ui/button';
import { Input } from '../features/shared/components/ui/input';
import { Label } from '../features/shared/components/ui/label';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { login } = useAuthStore();

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        const { user, token } = fetcher.data;
        login(user, token);
        navigate('/dashboard');
      } else {
        setError(fetcher.data.error || 'Đăng nhập thất bại');
      }
    }
  }, [fetcher.data, login, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Use fetcher to submit to the API
    const params = new URLSearchParams({ email, password });
    fetcher.load(`/api/login?${params.toString()}`);
  };

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
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={fetcher.state === 'loading'}
                placeholder="Nhập email của bạn"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={fetcher.state === 'loading'}
                placeholder="Nhập mật khẩu"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={fetcher.state === 'loading'}
            >
              {fetcher.state === 'loading' ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

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
