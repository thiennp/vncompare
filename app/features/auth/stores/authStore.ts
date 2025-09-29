import { create } from 'zustand';
import { User } from '../../shared/services/models';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>(set => ({
  // State
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  // Actions
  setUser: user => set({ user }),
  setToken: token => set({ token, isAuthenticated: true }),
  setLoading: isLoading => set({ isLoading }),

  login: (user, token) => {
    set({ user, token, isAuthenticated: true, isLoading: false });
    // Don't set cookie here - server already sets it
    // Cookies.set('auth_token', token, { expires: 7 }); // 7 days
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    Cookies.remove('auth_token');
  },

  clearAuth: () => {
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    Cookies.remove('auth_token');
  },
}));

// Initialize auth state from cookies on app start
export const initializeAuth = () => {
  const token = Cookies.get('auth_token');
  if (token) {
    useAuthStore.getState().setToken(token);
    // Note: We'll verify the token in the app initialization
  } else {
    useAuthStore.getState().setLoading(false);
  }
};
