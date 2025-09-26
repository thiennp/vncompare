import { useLoaderData } from 'react-router-dom';
import { User } from '../../lib/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Users, Edit, Trash2 } from 'lucide-react';

interface AdminUsersPageData {
  users: User[];
  total: number;
  page: number;
  role: string;
}

export default function AdminUsersPage() {
  const {
    users,
    total,
    page: _page,
    role: _role,
  } = useLoaderData() as AdminUsersPageData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Quản lý người dùng
        </h1>
        <p className="text-lg text-gray-600">
          Quản lý {total} người dùng trong hệ thống
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả người dùng</CardTitle>
          <CardDescription>
            Danh sách tất cả người dùng đã đăng ký
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map(user => (
                <div
                  key={user._id?.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name || user.email}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={
                            user.role === 'admin'
                              ? 'default'
                              : user.role === 'supplier'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {user.role === 'customer'
                            ? 'Khách hàng'
                            : user.role === 'admin'
                              ? 'Quản trị viên'
                              : 'Nhà cung cấp'}
                        </Badge>
                        {user.phone && (
                          <Badge variant="outline">{user.phone}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Tham gia:{' '}
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    {user.lastLoginAt && (
                      <p className="text-sm text-gray-600">
                        Đăng nhập cuối:{' '}
                        {new Date(user.lastLoginAt).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có người dùng
              </h3>
              <p className="text-gray-600">
                Chưa có người dùng nào trong hệ thống
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
