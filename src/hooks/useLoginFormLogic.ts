import { useState, useCallback, FormEvent, useEffect, useRef } from 'react';
import { useFetcher, useNavigate } from 'react-router-dom';

export function useLoginFormLogic() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      // Use React Router fetcher instead of direct fetch
      fetcher.submit(formData, {
        method: 'POST',
        action: '/api/login',
      });
    },
    [email, password, fetcher]
  );

  // Handle successful login redirect
  useEffect(() => {
    console.log('Login effect triggered:', {
      data: fetcher.data,
      state: fetcher.state,
    });

    if (fetcher.data && fetcher.data.success && !hasNavigated.current) {
      console.log('Login successful, navigating...', fetcher.data.user);

      // Mark as navigated to prevent double execution
      hasNavigated.current = true;

      // Prepare user data
      const userData = {
        _id: fetcher.data.user._id || fetcher.data.user.email,
        email: fetcher.data.user.email,
        name: fetcher.data.user.name,
        role: fetcher.data.user.role,
        token: fetcher.data.token,
      };

      // Save auth token to cookie
      const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
      document.cookie = `auth_token=${fetcher.data.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      console.log('✅ Token saved to cookie');

      // Save user data to localStorage (needed for useAuth hook)
      localStorage.setItem('paint_user', JSON.stringify(userData));
      console.log('✅ User data saved to localStorage');

      // Dispatch login event
      window.dispatchEvent(
        new CustomEvent('paint:login', { detail: userData })
      );

      // Redirect based on user role
      const redirectPath =
        fetcher.data.user.role === 'admin' ? '/admin' : '/dashboard';

      console.log('Navigating to:', redirectPath);

      // Use setTimeout to break out of the current render cycle
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 50);
    } else if (fetcher.data && !fetcher.data.success) {
      console.error('Login failed:', fetcher.data.error);
    }
  }, [fetcher.data, fetcher.state, navigate]);

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleSubmit,
    isSubmitting: fetcher.state === 'submitting',
    result: fetcher.data,
  };
}
