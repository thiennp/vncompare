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

  const navigation: Array<{
    name: string;
    href: string;
    icon: any;
    shortName: string;
  }> = [
    {
      name: 'Máy tính độ phủ',
      href: '/coverage-calculator',
      icon: Calculator,
      shortName: 'Tính độ phủ',
    },
    {
      name: 'Tính phí vận chuyển',
      href: '/shipping-calculator',
      icon: Truck,
      shortName: 'Tính phí ship',
    },
  ];

  const categories = [
    {
      name: 'Sơn nội thất',
      href: '/products?category=interior',
      icon: Package,
      description: 'Sơn cho nội thất',
    },
    {
      name: 'Sơn ngoại thất',
      href: '/products?category=exterior',
      icon: Package,
      description: 'Sơn cho ngoại thất',
    },
    {
      name: 'Sơn chuyên dụng',
      href: '/products?category=specialty',
      icon: Package,
      description: 'Sơn chuyên dụng',
    },
  ];

  const adminNavigation: Array<{
    name: string;
    href: string;
    icon: any;
    shortName?: string;
  }> = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      shortName: 'Dashboard',
    },
    {
      name: 'Sản phẩm',
      href: '/admin/products',
      icon: Package,
      shortName: 'Sản phẩm',
    },
    {
      name: 'Đơn hàng',
      href: '/admin/orders',
      icon: null,
      shortName: 'Đơn hàng',
    },
    {
      name: 'Người dùng',
      href: '/admin/users',
      icon: User,
      shortName: 'Người dùng',
    },
    {
      name: 'Nhà cung cấp',
      href: '/admin/suppliers',
      icon: null,
      shortName: 'Nhà cung cấp',
    },
    {
      name: 'Đánh giá',
      href: '/admin/reviews',
      icon: null,
      shortName: 'Đánh giá',
    },
  ];

  const currentNavigation = isAdminRoute ? adminNavigation : navigation;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-50 w-full border-b border-paint-orange/20 bg-gradient-to-r from-paint-orange/10 via-paint-teal/10 to-paint-purple/10 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80"
        role="banner"
      >
        <div className="container flex h-20 items-center justify-between px-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 flex-shrink-0 group"
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-paint-orange via-paint-pink to-paint-purple flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Paintbrush className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-2xl text-gray-900 tracking-tight">
                VNCompare
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                Sơn
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Apple Style */}
          <nav className="hidden lg:flex items-center space-x-2 flex-1 justify-center max-w-2xl">
            {currentNavigation.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-paint-orange/20 focus:ring-offset-2 rounded-xl px-4 py-2.5 whitespace-nowrap ${
                    location.pathname === item.href
                      ? 'text-paint-orange bg-paint-orange/10 shadow-sm'
                      : 'text-gray-700 hover:text-paint-orange hover:bg-paint-orange/5'
                  }`}
                  title={item.name}
                >
                  {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                  <span className="hidden xl:inline">{item.name}</span>
                  <span className="xl:hidden">
                    {item.shortName || item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right side actions - Apple Style */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            {!isLoginPage && (
              <Link to="/cart" className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold"
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 rounded-full border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <Link to="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-3 rounded-full hover:bg-gray-100 transition-all duration-200"
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">
                        {user?.name || user?.email}
                      </span>
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="h-9 w-9 rounded-full hover:bg-gray-100 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              !isLoginPage && (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 rounded-full hover:bg-gray-100 transition-all duration-200"
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      size="sm"
                      className="h-9 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 hover:scale-105"
                    >
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )
            )}

            {/* Mobile menu button - Apple Style */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-10 w-10 rounded-full hover:bg-gray-100 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Apple Style */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-xl">
            <div className="container py-6">
              <nav className="space-y-6">
                {/* Tools Section */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    Công cụ
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {currentNavigation.map(item => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`group flex items-center gap-3 text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-2xl px-4 py-3 ${
                            location.pathname === item.href
                              ? 'text-blue-600 bg-blue-50 shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                          <span className="truncate font-semibold">
                            {item.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Categories Section */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    Danh mục sơn
                  </h3>
                  <div className="space-y-2">
                    {categories.map(category => {
                      const Icon = category.icon;
                      const isActive =
                        location.pathname === category.href ||
                        (location.pathname === '/products' &&
                          location.search.includes(
                            category.href.split('?')[1]
                          ));

                      return (
                        <Link
                          key={category.name}
                          to={category.href}
                          className={`group flex items-center gap-3 text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 rounded-2xl px-4 py-3 ${
                            isActive
                              ? 'text-blue-600 bg-blue-50 shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                          <span className="truncate font-semibold">
                            {category.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Category Navigation - Simple */}
      {!isAdminRoute && !isLoginPage && (
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="container py-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map(category => {
                const Icon = category.icon;
                const isActive =
                  location.pathname === category.href ||
                  (location.pathname === '/products' &&
                    location.search.includes(category.href.split('?')[1]));

                return (
                  <Link
                    key={category.name}
                    to={category.href}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      isActive
                        ? 'bg-paint-orange text-white shadow-sm'
                        : 'text-gray-600 hover:text-paint-orange hover:bg-paint-orange/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
                thương hiệu hàng đầu & thi công tiện lợi tại hơn 1.000 đối tác.
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
              &copy; 2025 VNCompare Nền tảng so sánh Sơn. Tất cả nội dung thuộc
              bản quyền của chúng tôi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
