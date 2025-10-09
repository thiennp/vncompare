// Mock sidebar component for paint project
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: any;
    description: string;
  }>;
}

export default function Sidebar({ navigation }: SidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quản trị</h2>
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-paint-orange/10 text-paint-orange'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}