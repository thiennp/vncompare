// Custom hook for authentication logic
import { useAuth } from '../AuthContext';
import { AuthLogicService } from '../services/auth-logic.service';

export function useAuthLogic() {
  const { user, logout, isAuthenticated } = useAuth();
  
  const isAdmin = AuthLogicService.isAdmin(user);
  const isSupplier = AuthLogicService.isSupplier(user);
  const displayName = AuthLogicService.getUserDisplayName(user);
  const initials = AuthLogicService.getUserInitials(user);
  const roleDisplayName = user ? AuthLogicService.getRoleDisplayName(user.role) : '';
  
  return {
    user,
    isAuthenticated,
    isAdmin,
    isSupplier,
    displayName,
    initials,
    roleDisplayName,
    logout,
  };
}
