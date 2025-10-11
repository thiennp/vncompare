// Mock header component for paint project
import React from 'react';

interface HeaderProps {
  isAuthenticated: boolean;
  isAuthRoute: boolean;
  displayName?: string;
  initials?: string;
  totalItems: number;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  onLogout: () => void;
  navigation: any[];
  userMenuItems: any[];
}

export default function Header({
  isAuthenticated,
  isAuthRoute,
  displayName,
  initials,
  totalItems,
  isMobileMenuOpen,
  onMobileMenuToggle,
  onLogout,
  navigation,
  userMenuItems,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-paint-orange">Paint Admin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Xin chào, {displayName}</span>
                <button
                  onClick={onLogout}
                  className="text-sm text-paint-orange hover:text-paint-orange/80"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}