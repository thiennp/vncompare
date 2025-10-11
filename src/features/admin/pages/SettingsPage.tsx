import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Trash2, Database, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetResult, setResetResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleResetDatabase = async () => {
    if (!confirm('Bạn có chắc chắn muốn reset toàn bộ database? Hành động này không thể hoàn tác!')) {
      return;
    }

    setIsResetting(true);
    setResetResult(null);

    try {
      const token = localStorage.getItem('paint_user');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      const userData = JSON.parse(token);
      const response = await fetch('/api/reset-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setResetResult({
          type: 'success',
          message: 'Database đã được reset thành công!'
        });
      } else {
        setResetResult({
          type: 'error',
          message: result.error || 'Có lỗi xảy ra khi reset database'
        });
      }
    } catch (error) {
      setResetResult({
        type: 'error',
        message: 'Không thể kết nối đến server'
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý cài đặt và cấu hình hệ thống
        </p>
      </div>

      <div className="grid gap-6">
        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Quản lý Database
            </CardTitle>
            <CardDescription>
              Reset toàn bộ database về trạng thái ban đầu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Cảnh báo:</strong> Hành động này sẽ xóa toàn bộ dữ liệu trong database bao gồm:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Tất cả người dùng (trừ tài khoản admin hardcoded)</li>
                  <li>Tất cả sản phẩm</li>
                  <li>Tất cả đơn hàng</li>
                  <li>Tất cả nhà cung cấp</li>
                  <li>Tất cả đánh giá</li>
                </ul>
                <p className="mt-2 font-semibold text-red-600">
                  Hành động này không thể hoàn tác!
                </p>
              </AlertDescription>
            </Alert>

            {resetResult && (
              <Alert className={resetResult.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                <AlertDescription className={resetResult.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                  {resetResult.message}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleResetDatabase}
              disabled={isResetting}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              {isResetting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang reset...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset Database
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin hệ thống</CardTitle>
            <CardDescription>
              Thông tin về phiên bản và cấu hình hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phiên bản</label>
                <p className="text-sm">1.0.0</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Môi trường</label>
                <p className="text-sm">Production</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Database</label>
                <p className="text-sm">MongoDB Atlas</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Hosting</label>
                <p className="text-sm">Vercel</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
