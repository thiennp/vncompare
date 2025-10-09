import React from 'react';
import { useLoginFormLogic } from '../hooks/useLoginFormLogic';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function LoginPage() {
  const {
    email,
    password,
    setEmail,
    setPassword,
    handleSubmit,
    isSubmitting,
    result,
  } = useLoginFormLogic();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>Đăng nhập để bắt đầu sử dụng Paint</CardDescription>
        </CardHeader>
        <CardContent>
          {result && !result.success && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
              {result.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-paint-orange/20 focus:border-paint-orange transition-colors"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-paint-orange/20 focus:border-paint-orange transition-colors"
                required
                disabled={isSubmitting}
              />
            </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <a 
                href="/admin" 
                className="text-sm text-paint-orange hover:text-paint-orange/80 underline"
              >
                Truy cập trang quản trị
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
