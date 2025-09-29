// Get admin navigation items
import { AdminNavigationItem } from './types';
import { BarChart3, Package, ShoppingCart, Users, Building2, Star } from 'lucide-react';

export function getAdminNavigation(): AdminNavigationItem[] {
  return [
    {
      name: 'Bảng điều khiển',
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
      icon: ShoppingCart,
      shortName: 'Đơn hàng',
    },
    {
      name: 'Người dùng',
      href: '/admin/users',
      icon: Users,
      shortName: 'Người dùng',
    },
    {
      name: 'Nhà cung cấp',
      href: '/admin/suppliers',
      icon: Building2,
      shortName: 'Nhà cung cấp',
    },
    {
      name: 'Đánh giá',
      href: '/admin/reviews',
      icon: Star,
      shortName: 'Đánh giá',
    },
  ];
}
