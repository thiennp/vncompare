// Get admin navigation items
import { AdminNavigationItem } from './types';
import { BarChart3, Package } from 'lucide-react';

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
      icon: () => null,
      shortName: 'Đơn hàng',
    },
    {
      name: 'Người dùng',
      href: '/admin/users',
      icon: () => null,
      shortName: 'Người dùng',
    },
    {
      name: 'Nhà cung cấp',
      href: '/admin/suppliers',
      icon: () => null,
      shortName: 'Nhà cung cấp',
    },
    {
      name: 'Đánh giá',
      href: '/admin/reviews',
      icon: () => null,
      shortName: 'Đánh giá',
    },
  ];
}
