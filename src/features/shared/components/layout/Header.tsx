// Pure header component - no business logic
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';

interface HeaderProps {
  isAuthenticated: boolean;
  isAdminRoute: boolean;
  isAuthRoute: boolean;
  displayName: string;
  initials: string;
  totalItems: number;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  onLogout: () => void;
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ComponentType;
    shortName: string;
  }>;
  userMenuItems: Array<{
    name: string;
    href: string;
    icon: React.ComponentType;
    action?: string;
  }>;
}

export default function Header({
  isAuthenticated,
  isAdminRoute,
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
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-paint-orange rounded-lg flex items-center justify-center">
                <Paintbrush className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                VNCompare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isAuthRoute && (
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-paint-orange transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-paint-orange transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-paint-orange transition-colors">
                    <div className="w-8 h-8 bg-paint-orange rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {initials}
                    </div>
                    <span className="hidden md:block">{displayName}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={item.action === 'logout' ? onLogout : undefined}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline">Đăng nhập</Button>
                </Link>
                <Link to="/register">
                  <Button>Đăng ký</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            {!isAuthRoute && (
              <button
                onClick={onMobileMenuToggle}
                className="md:hidden p-2 text-gray-700 hover:text-paint-orange transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
