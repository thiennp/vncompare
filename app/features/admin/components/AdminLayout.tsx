import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { Button } from '../../shared/components/ui/button';
import { Avatar, AvatarFallback } from '../../shared/components/ui/avatar';
import { Separator } from '../../shared/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '../../shared/components/ui/sheet';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Building2,
  Star,
  LogOut,
  Menu,
  Home,
  Paintbrush,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const adminNavigation = [
    {
      name: 'Bảng điều khiển',
      href: '/admin',
      icon: BarChart3,
      description: 'Tổng quan hệ thống',
    },
    {
      name: 'Sản phẩm',
      href: '/admin/products',
      icon: Package,
      description: 'Quản lý sản phẩm',
    },
    {
      name: 'Đơn hàng',
      href: '/admin/orders',
      icon: ShoppingCart,
      description: 'Quản lý đơn hàng',
    },
    {
      name: 'Người dùng',
      href: '/admin/users',
      icon: Users,
      description: 'Quản lý người dùng',
    },
    {
      name: 'Nhà cung cấp',
      href: '/admin/suppliers',
      icon: Building2,
      description: 'Quản lý nhà cung cấp',
    },
    {
      name: 'Đánh giá',
      href: '/admin/reviews',
      icon: Star,
      description: 'Quản lý đánh giá',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3 px-6 py-4 border-b">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
          <Paintbrush className="h-4 w-4 text-white" />
        </div>
        {!isSidebarCollapsed && (
          <div>
            <h1 className="text-lg font-semibold text-gray-900">VNCompare</h1>
            <p className="text-xs text-gray-500">Bảng quản trị</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {adminNavigation.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              title={isSidebarCollapsed ? item.name : undefined}
            >
              <Icon className={`${isSidebarCollapsed ? 'h-5 w-5' : 'h-4 w-4'} flex-shrink-0`} />
              {!isSidebarCollapsed && (
                <div className="flex-1">
                  <div>{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-gray-500">Quản trị viên</p>
            </div>
          )}
        </div>

        <Separator className="my-3" />

        <div className="space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            title={isSidebarCollapsed ? "Về trang chủ" : undefined}
          >
            <Home className={`${isSidebarCollapsed ? 'h-5 w-5' : 'h-4 w-4'}`} />
            {!isSidebarCollapsed && "Về trang chủ"}
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            title={isSidebarCollapsed ? "Đăng xuất" : undefined}
          >
            <LogOut className={`${isSidebarCollapsed ? 'h-5 w-5' : 'h-4 w-4'}`} />
            {!isSidebarCollapsed && "Đăng xuất"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-purple-500 to-blue-500">
            <Paintbrush className="h-3 w-3 text-white" />
          </div>
          <span className="font-semibold text-gray-900">VNCompare Admin</span>
        </div>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 ${isSidebarCollapsed ? 'lg:w-16' : 'lg:w-80'}`}>
          <div className="flex flex-col flex-grow bg-white border-r">
            <SidebarContent />
          </div>
        </div>

        {/* Desktop Toggle Button */}
        <div className={`hidden lg:block fixed top-4 z-50 transition-all duration-300 ${isSidebarCollapsed ? 'left-20' : 'left-80'}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="bg-white shadow-lg hover:shadow-xl"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Main Content */}
        <div className={`flex flex-col flex-1 ${isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-80'}`}>
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
