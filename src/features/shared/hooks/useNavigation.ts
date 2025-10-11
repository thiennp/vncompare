// Navigation hook for paint project
import { useLocation } from 'react-router-dom';
import { getAdminNavigation } from '../services/getAdminNavigation';

export function useNavigation() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register');

  const publicNavigation = [];
  const adminNavigation = getAdminNavigation();
  const userMenuItems = [];

  return {
    isAdminRoute,
    isAuthRoute,
    publicNavigation,
    adminNavigation,
    userMenuItems,
  };
}
