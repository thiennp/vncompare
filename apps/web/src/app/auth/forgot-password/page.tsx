'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import LoginForm from '@/components/auth/LoginForm';

export default function ForgotPasswordPage() {
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  const handleBackToLogin = () => {
    setIsLogin(true);
  };

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  if (isLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="w-full max-w-md">
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => router.push('/auth/register')}
          />
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(false)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
      </div>
    </div>
  );
}
