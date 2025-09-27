// Get user menu items
import { User, LogOut } from 'lucide-react';

export function getUserMenuItems() {
  return [
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
}
