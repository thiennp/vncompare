// Header component with server-side auth data
import { Link } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { ShoppingCart, Menu, X, Paintbrush } from 'lucide-react';
import { useCartLogic } from '../../../cart/hooks/useCartLogic';
import { useNavigation } from '../../hooks/useNavigation';
import {
  getUserDisplayName,
  getUserInitials,
} from '../../../auth/services/auth-logic.service';
import { getUserMenuItems } from '../../services/getUserMenuItems';
import { User } from '../../services/models';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  user: User | null;
  isAuthenticated: boolean;
}

export default function Header({
  isMobileMenuOpen,
  onMobileMenuToggle,
  user,
  isAuthenticated,
}: HeaderProps) {
  // Get cart state
  const { totalItems } = useCartLogic();

  // Get navigation state
  const { isAuthRoute, publicNavigation, adminNavigation } = useNavigation();

  // Get user menu items based on user role
  const userMenuItems = getUserMenuItems(user?.role);

  // Calculate auth-related values from user prop
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);

  // Simple logout function
  const logout = () => {
    // Redirect to logout API endpoint
    window.location.href = '/api/logout';
  };

  // Determine which navigation to use
  // Show admin navigation if user is admin, otherwise show public navigation
  const isAdmin = user?.role === 'admin';
  const navigation = isAdmin ? adminNavigation : publicNavigation;
  return (
    <header className="sticky top-0 z-50 w-full border-b border-paint-orange/20 bg-gradient-to-r from-paint-orange/10 via-paint-teal/10 to-paint-purple/10 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-20 items-center justify-between px-6">
        <Link
          className="flex items-center space-x-3 flex-shrink-0 group"
          to="/"
        >
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-paint-orange via-paint-pink to-paint-purple flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <Paintbrush className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-2xl text-gray-900 tracking-tight">
              VNCompare
            </span>
            <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">
              Sơn
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {!isAuthRoute && (
          <nav className="hidden lg:flex items-center space-x-2 flex-1 justify-center max-w-2xl">
            {navigation.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-paint-orange/20 focus:ring-offset-2 rounded-xl px-4 py-2.5 whitespace-nowrap text-gray-700 hover:text-paint-orange hover:bg-paint-orange/5"
                >
                  <div className="h-4 w-4 flex-shrink-0 flex items-center justify-center">
                    <Icon />
                  </div>
                  <span className="hidden xl:inline">{item.name}</span>
                  <span className="xl:hidden">{item.shortName}</span>
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              {/* Cart */}
              <Link
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-paint-orange hover:text-paint-orange hover:scale-105 px-4 text-xs relative h-10 w-10 rounded-full hover:bg-gray-100 transition-all duration-200"
                to="/cart"
              >
                <ShoppingCart className="h-5 w-5" />
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
                  {userMenuItems.map(item => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={item.action === 'logout' ? logout : undefined}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-paint-orange hover:text-paint-orange hover:scale-105 text-xs h-9 px-4 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gradient-to-r from-paint-orange to-paint-pink shadow-lg hover:shadow-xl text-xs h-9 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 hover:scale-105"
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isAuthRoute && (
            <button
              onClick={onMobileMenuToggle}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paint-orange/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-paint-orange hover:text-paint-orange hover:scale-105 px-4 text-xs lg:hidden h-10 w-10 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
