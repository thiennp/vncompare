import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigation } from '../hooks/useNavigation';
import { useAuthLogic } from '../../auth/hooks/useAuthLogic';
import { useCartLogic } from '../../cart/hooks/useCartLogic';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import MobileMenu from './layout/MobileMenu';

export default function Layout() {
  // Business logic hooks
  const { isAuthenticated, displayName, initials, logout } = useAuthLogic();
  const { totalItems } = useCartLogic();
  const { 
    isAdminRoute, 
    isAuthRoute, 
    publicNavigation, 
    adminNavigation, 
    userMenuItems 
  } = useNavigation();
  
  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Event handlers
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  // Determine which navigation to use
  const navigation = isAdminRoute ? adminNavigation : publicNavigation;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        isAuthenticated={isAuthenticated}
        isAuthRoute={isAuthRoute}
        displayName={displayName}
        initials={initials}
        totalItems={totalItems}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
        onLogout={handleLogout}
        navigation={navigation}
        userMenuItems={userMenuItems}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        navigation={navigation}
      />

      {/* Main Content */}
      <div className="flex">
        {/* Admin Sidebar */}
        {isAdminRoute && (
          <Sidebar navigation={adminNavigation} />
        )}

        {/* Page Content */}
        <main className={`flex-1 ${isAdminRoute ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}