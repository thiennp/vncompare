// Pure sidebar component - no business logic
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ComponentType;
    shortName?: string;
  }>;
}

export default function Sidebar({ navigation }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-50 border-r min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Bảng quản trị
        </h2>
        <nav className="space-y-2">
          {navigation.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-paint-orange text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
