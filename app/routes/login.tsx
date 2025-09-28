import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useFetcher } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuthStore();
  const fetcher = useFetcher();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    fetcher.submit(formData, {
      method: 'POST',
      action: '/api/login',
    });
  };

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success && fetcher.data.user && fetcher.data.token) {
        // Update Zustand store with user and token
        login(fetcher.data.user, fetcher.data.token);
        navigate('/dashboard');
      } else {
        setError(fetcher.data.error || 'Đăng nhập thất bại');
      }
    }
  }, [fetcher.data, navigate, login]);

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
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={fetcher.state === 'submitting'}
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
                disabled={fetcher.state === 'submitting'}
              />
            </div>

            <Button type="submit" className="w-full" disabled={fetcher.state === 'submitting'}>
              {fetcher.state === 'submitting' ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
