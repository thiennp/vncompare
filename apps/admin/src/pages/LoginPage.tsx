import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../../app/features/auth/stores/authStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../app/features/shared/components/ui/card';
import { Button } from '../../../../app/features/shared/components/ui/button';
import { Input } from '../../../../app/features/shared/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../app/features/shared/components/ui/form';
import { isLoginRequest } from '../../../../app/features/shared/types/guards';
import { isString, isType } from 'guardz';

interface LoginFormData {
  email: string;
  password: string;
}

const validateLoginForm = (data: LoginFormData) => {
  const errors: Record<string, string> = {};

  const isValidType = isType<LoginFormData>({
    email: isString,
    password: isString,
  })(data);

  if (!isValidType) {
    errors.general = 'Dữ liệu không hợp lệ';
    return { isValid: false, errors };
  }

  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email là bắt buộc';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!data.password || data.password.trim() === '') {
    errors.password = 'Mật khẩu là bắt buộc';
  } else if (data.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default function LoginPage() {
  const [error, setError] = React.useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    // no-op for initial mount
  }, []);

  const validateEmail = (value: string) => {
    if (!value || value.trim() === '') {
      return 'Email là bắt buộc';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email không hợp lệ';
    }
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value || value.trim() === '') {
      return 'Mật khẩu là bắt buộc';
    }
    if (value.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return true;
  };

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');

    const validation = validateLoginForm(data);
    if (!validation.isValid) {
      Object.entries(validation.errors).forEach(([field, message]) => {
        if (field === 'general') {
          setError(message);
        } else {
          form.setError(field as keyof LoginFormData, { message });
        }
      });
      return;
    }

    if (!isLoginRequest(data)) {
      setError('Dữ liệu đăng nhập không hợp lệ');
      return;
    }

    const isDataValid = isType<LoginFormData>({
      email: isString,
      password: isString,
    })(data);

    if (!isDataValid) {
      setError('Cấu trúc dữ liệu không hợp lệ');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', data.email.trim());
      formData.append('password', data.password);

      const response = await fetch('/api/login', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (responseData.success) {
        const { user, token } = responseData;
        login(user, token);
        navigate('/');
      } else {
        setError(responseData.error || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Đăng nhập thất bại');
    }
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="email"
                rules={{ validate: validateEmail }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Nhập email của bạn"
                        disabled={form.formState.isSubmitting}
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{ validate: validatePassword }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        disabled={form.formState.isSubmitting}
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          </Form>

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
