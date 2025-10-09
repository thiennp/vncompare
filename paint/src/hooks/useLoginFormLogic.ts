import { useState, useCallback, FormEvent } from 'react';
import { useFetcher } from 'react-router-dom';

export function useLoginFormLogic() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fetcher = useFetcher();

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
