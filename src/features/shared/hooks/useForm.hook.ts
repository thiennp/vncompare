// Mock form hook for paint project
import { useState } from 'react';

interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

export function useForm<T = any>(
  defaultValues: T,
  validation: Record<string, any>,
  submission: { endpoint: string; method: string }
) {
  const [formState, setFormState] = useState<FormState>({
    values: defaultValues as Record<string, any>,
    errors: {},
    isSubmitting: false,
  });

  const setValue = (name: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      errors: { ...prev.errors, [name]: '' },
    }));
  };

  const setError = (name: string, error: string) => {
    setFormState(prev => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
    }));
  };

  const clearErrors = () => {
    setFormState(prev => ({
      ...prev,
      errors: {},
    }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    Object.keys(validation).forEach(field => {
      const rules = validation[field];
      const value = formState.values[field];

      if (rules.required && (!value || value === '')) {
        errors[field] = `${field} là bắt buộc`;
      } else if (rules.minLength && value && value.length < rules.minLength) {
        errors[field] = `${field} phải có ít nhất ${rules.minLength} ký tự`;
      } else if (rules.pattern && value && !rules.pattern.test(value)) {
        errors[field] = `${field} không đúng định dạng`;
      }
    });

    setFormState(prev => ({ ...prev, errors }));
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const submit = async () => {
    setFormState(prev => ({ ...prev, isSubmitting: true }));

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setFormState(prev => ({ ...prev, isSubmitting: false }));

    return {
      success: true,
      data: formState.values,
    };
  };

  return {
    formState,
    setValue,
    setError,
    clearErrors,
    validate,
    submit,
  };
}
