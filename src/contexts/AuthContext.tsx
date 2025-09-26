import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '../lib/models';
import { authService } from '../lib/auth';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (userData: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  // eslint-disable-line react-refresh/only-export-components
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = Cookies.get('auth_token');
    if (storedToken) {
      setToken(storedToken);
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const result = await authService.verifyToken(tokenToVerify);
      if (result.success && result.user) {
        setUser(result.user);
        setToken(tokenToVerify);
      } else {
        // Token is invalid, remove it
        Cookies.remove('auth_token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      Cookies.remove('auth_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const result = await authService.login(email, password);
      console.log('🔐 Login result:', result.success);

      if (result.success && result.user && result.token) {
        setUser(result.user);
        setToken(result.token);
        Cookies.set('auth_token', result.token, {
          expires: 7,
          path: '/',
          secure: false, // Set to true in production with HTTPS
          sameSite: 'lax',
        }); // 7 days
        console.log('✅ Login successful, cookie set');
        return { success: true };
      } else {
        console.log('❌ Login failed:', result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
  }) => {
    try {
      const result = await authService.register(userData);
      if (result.success && result.user && result.token) {
        setUser(result.user);
        setToken(result.token);
        Cookies.set('auth_token', result.token, {
          expires: 7,
          path: '/',
          secure: false, // Set to true in production with HTTPS
          sameSite: 'lax',
        }); // 7 days
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('auth_token');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
