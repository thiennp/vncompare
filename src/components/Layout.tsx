import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Package,
  Settings,
  BarChart3,
  Calculator,
  Truck,
  Paintbrush,
} from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginPage =
    location.pathname === '/login' || location.pathname === '/register';

  const navigation = [
    { name: 'Trang chủ', href: '/', icon: null },
    {
      name: 'Sơn nội thất',
      href: '/products?category=interior',
      icon: Package,
    },
    {
      name: 'Sơn ngoại thất',
      href: '/products?category=exterior',
      icon: Package,
    },
    {
      name: 'Sơn chuyên dụng',
      href: '/products?category=specialty',
      icon: Package,
    },
    { name: 'Máy tính độ phủ', href: '/coverage-calculator', icon: Calculator },
    { name: 'Tính phí vận chuyển', href: '/shipping-calculator', icon: Truck },
  ];

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Sản phẩm', href: '/admin/products', icon: Package },
    { name: 'Đơn hàng', href: '/admin/orders', icon: null },
    { name: 'Người dùng', href: '/admin/users', icon: User },
    { name: 'Nhà cung cấp', href: '/admin/suppliers', icon: null },
    { name: 'Đánh giá', href: '/admin/reviews', icon: null },
  ];

  const currentNavigation = isAdminRoute ? adminNavigation : navigation;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Paintbrush className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl">VNCompare</span>
            <Badge variant="secondary" className="text-xs">
              Sơn
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {currentNavigation.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            {!isLoginPage && (
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {getTotalItems() > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* User menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {user?.role === 'admin' && !isAdminRoute && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}

                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name || user?.email}
                  </Button>
                </Link>

                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              !isLoginPage && (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Đăng ký</Button>
                  </Link>
                </div>
              )
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container py-4">
              <nav className="flex flex-col space-y-2">
                {currentNavigation.map(item => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-primary hover:bg-muted'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer - CHECK24 Style */}
      <footer className="border-t bg-gray-50">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">VNCompare Sơn</h3>
              <p className="text-sm text-muted-foreground">
                Nền tảng so sánh sơn hàng đầu Việt Nam. Hơn 1 triệu đề xuất,
                 thương hiệu hàng đầu & thi công tiện lợi tại hơn 1.000
                 đối tác.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Sơn theo loại</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/products?category=interior"
                    className="hover:text-primary"
                  >
                    Sơn nội thất
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=exterior"
                    className="hover:text-primary"
                  >
                    Sơn ngoại thất
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=specialty"
                    className="hover:text-primary"
                  >
                    Sơn chuyên dụng
                  </Link>
                </li>
                <li>
                  <Link
                    to="/coverage-calculator"
                    className="hover:text-primary"
                  >
                    Máy tính độ phủ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Dịch vụ</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/help" className="hover:text-primary">
                    Trợ giúp và liên hệ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping-calculator"
                    className="hover:text-primary"
                  >
                    Tính phí vận chuyển
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-primary">
                    Về VNCompare
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Pháp lý</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/privacy" className="hover:text-primary">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary">
                    Điều khoản
                  </Link>
                </li>
                <li>
                  <Link to="/imprint" className="hover:text-primary">
                    Thông tin công ty
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
               &copy; 2025 VNCompare Nền tảng so sánh Sơn. Tất cả nội dung thuộc bản quyền của chúng tôi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
