import { useEffect, useCallback } from 'react';
import { useFetcher } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Cookies from 'js-cookie';

export function useCookieWatcher() {
  const { setToken, setUser, setLoading, clearAuth } = useAuthStore();
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

  const checkAuthCookie = useCallback(() => {
    const token = Cookies.get('auth_token');

    if (token) {
      // Token exists, set it in store and verify it
      setToken(token);
      verifyToken(token);
    } else {
      // No token, clear auth state
      clearAuth();
    }
  }, [setToken, clearAuth, verifyToken]);

  // Handle fetcher response for token verification
  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle') {
      if (fetcher.data.success && fetcher.data.user) {
        setUser(fetcher.data.user);
        // Token is already set, just update user
      } else {
        // Verification failed, clear auth state
        clearAuth();
      }
      setLoading(false);
    }
  }, [fetcher.data, fetcher.state, setUser, clearAuth, setLoading]);

  // Watch for cookie changes
  useEffect(() => {
    // Initial check
    checkAuthCookie();

    // Set up interval to check for cookie changes
    const interval = setInterval(checkAuthCookie, 1000); // Check every second

    // Also listen for storage events (for cross-tab communication)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        checkAuthCookie();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthCookie]);

  return {
    checkAuthCookie,
  };
}
