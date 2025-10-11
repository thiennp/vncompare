import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../shared/components/ui/card';
import { RegisterForm } from '../../shared/components/forms/Form.component';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegisterSuccess = (result: {
    success: boolean;
    data?: unknown;
    error?: string;
  }) => {
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error || 'Đăng ký thất bại');
    }
  };

  const handleRegisterError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Đăng ký</CardTitle>
          <CardDescription>
            Tạo tài khoản mới để bắt đầu sử dụng VNCompare
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
              {error}
            </div>
          )}

          <RegisterForm
            onSubmit={handleRegisterSuccess}
            onError={handleRegisterError}
            className="space-y-4"
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
