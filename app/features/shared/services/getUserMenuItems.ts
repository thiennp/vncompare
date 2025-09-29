// Get user menu items
import { User, LogOut, Settings } from 'lucide-react';

export function getUserMenuItems(userRole?: string) {
  const baseItems = [
    {
      name: 'Tài khoản',
      href: '/profile',
      icon: User,
    },
    {
      name: 'Đăng xuất',
      href: '#',
      icon: LogOut,
      action: 'logout',
    },
  ];

  // Add admin-specific items if user is admin
  if (userRole === 'admin') {
    return [
      {
        name: 'Quản trị',
        href: '/admin',
        icon: Settings,
      },
      ...baseItems,
    ];
  }

  return baseItems;
}
