import { useState } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import { useNavigation } from '../hooks/useNavigation';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import MobileMenu from './layout/MobileMenu';
import { User } from '../services/models';

export default function Layout() {
  const loaderData = useLoaderData() as {
    user: User | null;
    isAuthenticated: boolean;
  };
  // Navigation logic
  const { isAdminRoute, publicNavigation, adminNavigation } = useNavigation();

  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Event handlers
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Determine which navigation to use
  const navigation = isAdminRoute ? adminNavigation : publicNavigation;

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
        user={loaderData.user}
        isAuthenticated={loaderData.isAuthenticated}
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
        {isAdminRoute && <Sidebar navigation={adminNavigation} />}

        {/* Page Content */}
        <main
          className={`flex-1 ${isAdminRoute ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
