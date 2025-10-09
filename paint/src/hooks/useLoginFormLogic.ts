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

      fetcher.submit(formData, {
        method: 'POST',
        action: '/api/login',
      });
    },
    [email, password, fetcher]
  );

  // Handle successful login redirect
  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      // Store user data and dispatch login event
      const userData = {
        _id: Date.now().toString(),
        email: fetcher.data.user.email,
        name: fetcher.data.user.name,
        role: fetcher.data.user.role,
        token: fetcher.data.token,
      };
      
      localStorage.setItem('paint_user', JSON.stringify(userData));
      window.dispatchEvent(new CustomEvent('paint:login', { detail: userData }));
      
      // Redirect to admin dashboard after successful login
      navigate('/admin');
    }
  }, [fetcher.data, navigate]);

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
