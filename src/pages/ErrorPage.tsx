import { useRouteError, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { AlertTriangle, Home } from 'lucide-react';

export default function ErrorPage() {
  const error = useRouteError() as Error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Đã xảy ra lỗi</CardTitle>
          <CardDescription>
            Có vẻ như đã xảy ra lỗi không mong muốn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error?.status && (
            <div className="p-3 bg-gray-100 rounded-md">
              <p className="text-sm font-medium">Mã lỗi: {error.status}</p>
              <p className="text-sm text-gray-600">
                {error.status === 404
                  ? 'Trang không tồn tại'
                  : error.status === 401
                    ? 'Bạn cần đăng nhập'
                    : error.status === 403
                      ? 'Bạn không có quyền truy cập'
                      : 'Đã xảy ra lỗi máy chủ'}
              </p>
            </div>
          )}

          {error?.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          )}

          <div className="space-y-2">
            <Link to="/">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Về trang chủ
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
