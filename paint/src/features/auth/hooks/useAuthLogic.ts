// Mock auth logic hook for paint project
import { useAuth } from './useAuth';

export function useAuthLogic() {
  const { user, isAuthenticated, logout } = useAuth();

  return {
    isAuthenticated,
    displayName: user?.name || user?.email || 'User',
    initials: user?.name?.charAt(0) || user?.email?.charAt(0) || 'U',
    logout,
  };
}
