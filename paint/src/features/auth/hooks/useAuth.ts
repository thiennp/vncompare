// Real auth hook for paint project with MongoDB
import { useState, useEffect } from 'react';
import { verifyAuth } from '../loaders/verifyAuthLoader';

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = async () => {
      try {
        const authUser = await verifyAuth();
        if (authUser) {
          // Get full user data from localStorage or API
          const storedUser = localStorage.getItem('paint_user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } else {
            // Fallback to basic auth data
            setUser({
              _id: authUser._id,
              email: authUser.email,
              name: authUser.email.split('@')[0],
              role: authUser.role,
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Listen for login events
  useEffect(() => {
    const handleLogin = (event: CustomEvent) => {
      const userData = event.detail;
      setUser(userData);
      localStorage.setItem('paint_user', JSON.stringify(userData));
      
      // Set auth token cookie
      document.cookie = `auth_token=${userData.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    };

    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('paint_user');
      // Clear auth token cookie
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    };

    window.addEventListener('paint:login', handleLogin as EventListener);
    window.addEventListener('paint:logout', handleLogout);

    return () => {
      window.removeEventListener('paint:login', handleLogin as EventListener);
      window.removeEventListener('paint:logout', handleLogout);
    };
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('paint_user');
    // Clear auth token cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('paint:logout'));
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
