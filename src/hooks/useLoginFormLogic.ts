import { useState, useCallback, FormEvent, useEffect } from 'react';
import { useFetcher, useNavigate } from 'react-router-dom';

export function useLoginFormLogic() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fetcher = useFetcher();
  const navigate = useNavigate();

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

    if (fetcher.data && fetcher.data.success) {
      console.log('Login successful, navigating...', fetcher.data.user);

      // Dispatch login event with user data (no localStorage per workspace rules)
      const userData = {
        _id: fetcher.data.user._id || fetcher.data.user.email,
        email: fetcher.data.user.email,
        name: fetcher.data.user.name,
        role: fetcher.data.user.role,
        token: fetcher.data.token,
      };

      window.dispatchEvent(
        new CustomEvent('paint:login', { detail: userData })
      );

      // Redirect based on user role
      const redirectPath =
        fetcher.data.user.role === 'admin' ? '/admin' : '/dashboard';

      console.log('Navigating to:', redirectPath);
      navigate(redirectPath, { replace: true });
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
