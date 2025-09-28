import { useEffect, useCallback } from 'react';
import { useFetcher } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    setUser,
    setToken,
    setLoading,
    clearAuth,
  } = useAuthStore();
  const fetcher = useFetcher();

  const verifyToken = useCallback(
    async (tokenToVerify: string) => {
      try {
        const formData = new FormData();
        formData.append('token', tokenToVerify);

        fetcher.submit(formData, {
          method: 'GET',
          action: '/api/verify',
        });
      } catch (error) {
        console.error('Token verification failed:', error);
        clearAuth();
      }
    },
    [fetcher, clearAuth]
  );

  // Initialize auth state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        verifyToken(storedToken);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [setToken, setLoading, verifyToken]);

  // Handle fetcher response for token verification
  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle') {
      if (fetcher.data.success && fetcher.data.user) {
        setUser(fetcher.data.user);
        setToken(fetcher.data.token);
      } else {
        clearAuth();
      }
      setLoading(false);
    }
  }, [fetcher.data, fetcher.state, setUser, setToken, clearAuth, setLoading]);

  const logout = () => {
    // Use fetcher to call logout API
    const formData = new FormData();
    fetcher.submit(formData, {
      method: 'POST',
      action: '/api/logout',
    });

    // Clear local state
    clearAuth();
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    logout,
  };
}
