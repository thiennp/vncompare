// Custom hook for navigation logic
import { useLocation } from 'react-router-dom';
import { 
  isAdminRoute, 
  isAuthRoute, 
  getPublicNavigation, 
  getAdminNavigation, 
  getUserMenuItems,
  getActiveNavigationItem
} from '../services/navigation.service';

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
