import { useLoaderData } from 'react-router-dom';
import { User, Order, Address } from '../services/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Package, ShoppingCart, MapPin, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardPageData {
  user: User;
  recentOrders: Order[];
  addresses: Address[];
}

export default function DashboardPage() {
  const { user, recentOrders, addresses } =
    useLoaderData() as DashboardPageData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chào mừng, {user.name || user.email}!
        </h1>
        <p className="text-lg text-gray-600">Đây là trang tổng quan của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentOrders.length}</div>
            <p className="text-xs text-muted-foreground">Đơn hàng gần đây</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Địa chỉ</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{addresses.length}</div>
            <p className="text-xs text-muted-foreground">Địa chỉ đã lưu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành viên từ</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(user.createdAt).toLocaleDateString('vi-VN')}
            </div>
            <p className="text-xs text-muted-foreground">Ngày đăng ký</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vai trò</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-sm">
              {user.role === 'customer'
                ? 'Khách hàng'
                : user.role === 'admin'
                  ? 'Quản trị viên'
                  : 'Nhà cung cấp'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Quyền truy cập</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>Các đơn hàng bạn đã đặt gần đây</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map(order => (
                  <div
                    key={order._id?.toString()}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        Đơn hàng #{order._id?.toString().slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.totalAmount.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          order.status === 'delivered'
                            ? 'default'
                            : order.status === 'shipped'
                              ? 'default'
                              : order.status === 'confirmed'
                                ? 'secondary'
                                : 'outline'
                        }
                      >
                        {order.status === 'pending'
                          ? 'Chờ xử lý'
                          : order.status === 'confirmed'
                            ? 'Đã xác nhận'
                            : order.status === 'shipped'
                              ? 'Đang giao'
                              : order.status === 'delivered'
                                ? 'Đã giao'
                                : 'Đã hủy'}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <Link to="/orders">
                    <Button variant="outline">Xem tất cả đơn hàng</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có đơn hàng
                </h3>
                <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào</p>
                <Link to="/products">
                  <Button>Mua sắm ngay</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>
              Các tính năng hữu ích dành cho bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/products" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Xem sản phẩm
                </Button>
              </Link>
              <Link to="/coverage-calculator" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Máy tính độ phủ
                </Button>
              </Link>
              <Link to="/shipping-calculator" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Tính phí vận chuyển
                </Button>
              </Link>
              <Link to="/profile" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Thông tin cá nhân
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
