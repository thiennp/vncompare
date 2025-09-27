// Custom hook for authentication logic
import { useAuth } from './useAuth';
import { 
  isAdmin, 
  isSupplier, 
  getUserDisplayName, 
  getUserInitials, 
  getRoleDisplayName 
} from '../services/auth-logic.service';

export function useAuthLogic() {
  const { user, logout, isAuthenticated } = useAuth();
  
  const isAdminCheck = isAdmin(user);
  const isSupplierCheck = isSupplier(user);
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const roleDisplayName = user ? getRoleDisplayName(user.role) : '';
  
  return {
    user,
    isAuthenticated,
    isAdmin: isAdminCheck,
    isSupplier: isSupplierCheck,
    displayName,
    initials,
    roleDisplayName,
    logout,
  };
}
