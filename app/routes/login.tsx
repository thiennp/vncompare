import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../features/shared/components/ui/form';
import { isLoginRequest } from '../features/shared/types/guards';
import { isString, isType } from 'guardz';

// Form data type
interface LoginFormData {
  email: string;
  password: string;
}

// Enhanced validation using guardz
const validateLoginForm = (data: LoginFormData) => {
  const errors: Record<string, string> = {};

  // First, validate with guardz for type safety
  const isValidType = isType<LoginFormData>({
    email: isString,
    password: isString,
  })(data);

  if (!isValidType) {
    errors.general = 'Dữ liệu không hợp lệ';
    return { isValid: false, errors };
  }

  // Email validation with guardz
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email là bắt buộc';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email không hợp lệ';
  }

  // Password validation with guardz
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

export default function Login() {
  const [error, setError] = React.useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Custom validation rules using guardz
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

    // Step 1: Validate with custom validation function (includes guardz type checking)
    const validation = validateLoginForm(data);
    if (!validation.isValid) {
      // Set form errors
      Object.entries(validation.errors).forEach(([field, message]) => {
        if (field === 'general') {
          setError(message);
        } else {
          form.setError(field as keyof LoginFormData, { message });
        }
      });
      return;
    }

    // Step 2: Validate with guardz LoginRequest type guard
    if (!isLoginRequest(data)) {
      setError('Dữ liệu đăng nhập không hợp lệ');
      return;
    }

    // Step 3: Additional guardz validation for runtime type safety
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
        navigate('/dashboard');
      } else {
        setError(responseData.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
