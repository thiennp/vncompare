import { useState, useTransition } from 'react';
import { Link, useLoaderData, useRevalidator } from 'react-router-dom';
import { User } from '../../shared/types';
import { db } from '../../shared/services/database.client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../shared/components/ui/card';
import { Badge } from '../../shared/components/ui/badge';
import { Button } from '../../shared/components/ui/button';
import {
  Users,
  Edit,
  Plus,
  Shield,
  UserCheck,
} from 'lucide-react';

interface AdminUsersPageData {
  users: User[];
  total: number;
  page: number;
  role: string;
}

export default function AdminUsersPage() {
  const { users, total } = useLoaderData() as AdminUsersPageData;
  const revalidator = useRevalidator();
  const [,] = useTransition();

  const [isLoading, setIsLoading] = useState(false);

  const handleToggleActive = async (user: User) => {
    if (!user._id) return;

    setIsLoading(true);
    try {
      await db.updateUser();
      revalidator.revalidate();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'supplier':
        return 'secondary';
      case 'customer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'supplier':
        return 'Nhà cung cấp';
      case 'customer':
        return 'Khách hàng';
      default:
        return 'Khách hàng';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quản lý người dùng
            </h1>
            <p className="text-lg text-gray-600">
              Quản lý {total} người dùng trong hệ thống
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/users/new">
              <Plus className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Link>
          </Button>
        </div>
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
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                        {user.phone && (
                          <Badge variant="outline">{user.phone}</Badge>
                        )}
                        {user.isActive === false && (
                          <Badge variant="destructive">Tạm dừng</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Đăng ký:{' '}
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
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/admin/users/${user._id?.toString()}/edit`} state={{ user }}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(user)}
                      disabled={isLoading}
                    >
                      {user.isActive ? (
                        <UserCheck className="h-4 w-4" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
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
              <p className="text-gray-600 mb-4">
                Thêm người dùng đầu tiên vào hệ thống
              </p>
              <Button asChild>
                <Link to="/admin/users/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm người dùng
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CRUD handled on dedicated pages; no modals here */}
    </div>
  );
}