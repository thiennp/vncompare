// Client-side auth hook for paint project
import { useState, useEffect } from 'react';

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  token?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('paint_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('paint_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Listen for login events
  useEffect(() => {
    const handleLogin = (event: CustomEvent) => {
      const userData = event.detail;
      setUser(userData);
      localStorage.setItem('paint_user', JSON.stringify(userData));
    };

    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('paint_user');
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
