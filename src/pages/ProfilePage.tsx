import { useLoaderData } from 'react-router-dom';
import { User, Address } from '../lib/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User as UserIcon, MapPin, Plus } from 'lucide-react';

interface ProfilePageData {
  user: User;
  addresses: Address[];
}

export default function ProfilePage() {
  const { user, addresses } = useLoaderData() as ProfilePageData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thông tin cá nhân
        </h1>
        <p className="text-lg text-gray-600">
          Quản lý thông tin tài khoản và địa chỉ của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserIcon className="mr-2 h-5 w-5" />
              Thông tin tài khoản
            </CardTitle>
            <CardDescription>Thông tin cơ bản của tài khoản</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Họ và tên
              </label>
              <p className="text-lg">{user.name || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Số điện thoại
              </label>
              <p className="text-lg">{user.phone || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Vai trò
              </label>
              <p className="text-lg">
                {user.role === 'customer'
                  ? 'Khách hàng'
                  : user.role === 'admin'
                    ? 'Quản trị viên'
                    : 'Nhà cung cấp'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Thành viên từ
              </label>
              <p className="text-lg">
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <Button className="w-full">Chỉnh sửa thông tin</Button>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Địa chỉ đã lưu
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Thêm địa chỉ
              </Button>
            </CardTitle>
            <CardDescription>
              Quản lý các địa chỉ giao hàng của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            {addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map(address => (
                  <div
                    key={address._id?.toString()}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{address.name}</h4>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.address}, {address.ward}, {address.district},{' '}
                          {address.province}
                        </p>
                        {address.isDefault && (
                          <span className="inline-block mt-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        Chỉnh sửa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có địa chỉ
                </h3>
                <p className="text-gray-600 mb-4">
                  Thêm địa chỉ để thuận tiện cho việc giao hàng
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm địa chỉ đầu tiên
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
