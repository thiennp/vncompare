import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../features/shared/components/ui/card';
import { LoginForm } from '../features/shared/components/forms/Form.component';

export default function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLoginSuccess = (result: {
    success: boolean;
    data?: unknown;
    error?: string;
  }) => {
    if (result.success && result.data) {
      const data = result.data as {
        user: {
          email: string;
          name: string;
          role: 'customer' | 'admin' | 'supplier';
          createdAt: string;
        };
        token: string;
      };
      login(data.user, data.token);
      navigate('/dashboard');
    } else {
      setError(result.error || 'Đăng nhập thất bại');
    }
  };

  const handleLoginError = (errorMessage: string) => {
    setError(errorMessage);
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

          <LoginForm
            onSubmit={handleLoginSuccess}
            onError={handleLoginError}
            className="space-y-4"
          />

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
