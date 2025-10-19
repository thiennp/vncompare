// Admin navigation for paint project
export interface AdminNavigationItem {
  name: string;
  href: string;
  icon: any;
  description: string;
}

export function getAdminNavigation(): AdminNavigationItem[] {
  return [
    {
      name: 'Bảng điều khiển',
      href: '/admin',
      icon: null, // Will be imported in component
      description: 'Tổng quan hệ thống',
    },
    {
      name: 'Sản phẩm',
      href: '/admin/products',
      icon: null,
      description: 'Quản lý sản phẩm',
    },
    {
      name: 'Đơn hàng',
      href: '/admin/orders',
      icon: null,
      description: 'Quản lý đơn hàng',
    },
    {
      name: 'Người dùng',
      href: '/admin/users',
      icon: null,
      description: 'Quản lý người dùng',
    },
    {
      name: 'Nhà cung cấp',
      href: '/admin/suppliers',
      icon: null,
      description: 'Quản lý nhà cung cấp',
    },
    {
      name: 'Đại lý',
      href: '/admin/agencies',
      icon: null,
      description: 'Quản lý đại lý các cấp',
    },
    {
      name: 'Đánh giá',
      href: '/admin/reviews',
      icon: null,
      description: 'Quản lý đánh giá',
    },
    {
      name: 'Cài đặt',
      href: '/settings',
      icon: null,
      description: 'Cài đặt hệ thống',
    },
  ];
}
