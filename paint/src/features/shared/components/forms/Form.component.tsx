import React from 'react';
import type { FieldValues } from 'react-hook-form';
import { Button } from '../ui/button';
import { FormField, FormError, FormLoading } from './FormField.component';
import type { FormProps } from '../../types/form.types';
import { useForm } from '../../hooks/useForm.hook';

// Generic form component following Open/Closed Principle
export const Form = <T extends FieldValues = FieldValues>({
  config,
  onSubmit,
  onError,
  className = '',
  children,
}: FormProps<T>) => {
  const { formState, setValue, setError, clearErrors, submit, validate } =
    useForm(config.defaultValues, config.validation, config.submission);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    clearErrors();

    // Validate form
    const validationResult = validate();
    if (!validationResult.isValid) {
      return;
    }

    try {
      const result = await submit();

      if (result.success) {
        onSubmit?.(result);
      } else {
        const errorMessage = result.error || 'Có lỗi xảy ra';
        setError('form', errorMessage);
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Có lỗi xảy ra';
      setError('form', errorMessage);
      onError?.(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <FormLoading isLoading={formState.isSubmitting}>
        {config.fields.map(field => (
          <FormField
            key={field.name}
            field={field}
            value={formState.values[field.name as keyof T]}
            error={formState.errors[field.name]}
            onChange={value => setValue(field.name, value)}
            disabled={formState.isSubmitting}
          />
        ))}

        {formState.errors.form && <FormError error={formState.errors.form} />}

        {children}
      </FormLoading>
    </form>
  );
};

// Specialized form components for common use cases
export const LoginForm: React.FC<{
  onSubmit?: (result: {
    success: boolean;
    data?: unknown;
    error?: string;
  }) => void;
  onError?: (error: string) => void;
  className?: string;
}> = ({ onSubmit, onError, className = '' }) => {
  const config = {
    fields: [
      { name: 'email', label: 'Email', type: 'email' as const, required: true },
      { name: 'password', label: 'Mật khẩu', type: 'password' as const, required: true },
    ],
    defaultValues: { email: '', password: '' },
    validation: {
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      password: { required: true, minLength: 6 },
    },
    submission: {
      endpoint: '/api/login',
      method: 'POST',
    },
  };

  return (
    <Form
      config={config}
      onSubmit={onSubmit}
      onError={onError}
      className={className}
    >
      <Button type="submit" className="w-full">
        Đăng nhập
      </Button>
    </Form>
  );
};