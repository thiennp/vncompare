import { useLoaderData } from 'react-router-dom';
import { User } from '../../shared/services/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import {
  Users,
  Package,
  ShoppingCart,
  Building2,
  DollarSign,
  Clock,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminDashboardPageData {
  user: User;
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalSuppliers: number;
    totalRevenue: number;
    pendingOrders: number;
    pendingReviews: number;
  };
}

export default function AdminDashboardPage() {
  const { user, stats } = useLoaderData() as AdminDashboardPageData;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Bảng điều khiển quản trị
        </h1>
        <p className="text-lg text-gray-600">
          Chào mừng, {user.name || user.email}! Đây là trang quản trị hệ thống.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng người dùng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Người dùng đã đăng ký
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Sản phẩm trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Tổng đơn hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhà cung cấp</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              Nhà cung cấp đã đăng ký
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Pending Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalRevenue.toLocaleString('vi-VN')} VNĐ
            </div>
            <p className="text-xs text-muted-foreground">
              Doanh thu từ đơn hàng đã thanh toán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đơn hàng chờ xử lý
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendingOrders}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý ngay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đánh giá chờ duyệt
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.pendingReviews}
            </div>
            <p className="text-xs text-muted-foreground">Cần duyệt</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quản lý sản phẩm</CardTitle>
            <CardDescription>
              Thêm, sửa, xóa sản phẩm trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/products">
              <Button className="w-full">Quản lý sản phẩm</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quản lý đơn hàng</CardTitle>
            <CardDescription>
              Xem và xử lý các đơn hàng của khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/orders">
              <Button className="w-full">Quản lý đơn hàng</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quản lý người dùng</CardTitle>
            <CardDescription>
              Quản lý tài khoản người dùng và nhà cung cấp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/users">
              <Button className="w-full">Quản lý người dùng</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quản lý nhà cung cấp</CardTitle>
            <CardDescription>
              Xác minh và quản lý các nhà cung cấp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/suppliers">
              <Button className="w-full">Quản lý nhà cung cấp</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quản lý đánh giá</CardTitle>
            <CardDescription>
              Duyệt và quản lý đánh giá sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/reviews">
              <Button className="w-full">Quản lý đánh giá</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cài đặt hệ thống</CardTitle>
            <CardDescription>Cấu hình các thông số hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Cài đặt
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
