// Mock auth hook for paint project
import { useState, useEffect } from 'react';

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
    // Mock user data
    setUser({
      _id: '1',
      email: 'admin@paint.com',
      name: 'Admin User',
      role: 'admin',
    });
    setIsLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    // In a real app, this would clear tokens and redirect
    console.log('Logout called');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
