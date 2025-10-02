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
import { Controller, useForm } from 'react-hook-form';

export default function Login() {
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuthStore();
  const fetcher = useFetcher();

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const submit = (e: React.FormEvent) => {
    console.log('submit');
    e.preventDefault();
    e.stopPropagation();
    console.log(form.getValues());
    form.handleSubmit(() => {
      setError('');

      const searchParams = new URLSearchParams();
      searchParams.append('email', form.getValues('email'));
      searchParams.append('password', form.getValues('password'));
      const url = `/api/login?${searchParams.toString()}`;
  
      fetcher.load(url);
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
          <form className="space-y-4" onSubmit={submit}>
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <Controller 
              name="email" 
              control={form.control}
              rules={{ required: true, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' } }}
              render={({ field }) => (
                <div className="space-y-2">
                  <fieldset>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      required
                      disabled={fetcher.state === 'submitting'}
                    />
                  </fieldset>
                </div>
              )} />

            <Controller
              name="password"
              control={form.control}
              rules={{ required: true, minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' } }}
              render={({ field }) => (
                <div className="space-y-2">
                  <fieldset>
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      required
                      disabled={fetcher.state === 'submitting'}
                    />
                  </fieldset>
                </div>
              )} />

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
