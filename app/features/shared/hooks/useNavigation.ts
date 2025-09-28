// Custom hook for navigation logic
import { useLocation } from 'react-router-dom';
import { isAdminRoute } from '../services/isAdminRoute';
import { isAuthRoute } from '../services/isAuthRoute';
import { getPublicNavigation } from '../services/getPublicNavigation';
import { getAdminNavigation } from '../services/getAdminNavigation';
import { getUserMenuItems } from '../services/getUserMenuItems';
import { getActiveNavigationItem } from '../services/getActiveNavigationItem';

export function useNavigation() {
  const location = useLocation();
  
  const isAdminRouteCheck = isAdminRoute(location.pathname);
  const isAuthRouteCheck = isAuthRoute(location.pathname);
  
  const publicNavigation = getPublicNavigation();
  const adminNavigation = getAdminNavigation();
  const userMenuItems = getUserMenuItems();
  
  const activeNavigationItem = getActiveNavigationItem(
    location.pathname, 
    isAdminRouteCheck ? adminNavigation : publicNavigation
  );
  
  return {
    isAdminRoute: isAdminRouteCheck,
    isAuthRoute: isAuthRouteCheck,
    publicNavigation,
    adminNavigation,
    userMenuItems,
    activeNavigationItem,
    currentPath: location.pathname,
  };
}
