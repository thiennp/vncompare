import { useState, useCallback, useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';
import type {
  UseFormReturn,
  FormState,
  FormSubmissionResult,
  FormSubmissionConfig,
  ValidationResult,
  FieldValidation,
} from '../types/form.types';
import { validateForm } from '../utils/form-validation.utils';
import {
  createFormSubmissionService,
  type FormSubmissionService,
} from '../services/form-submission.service';

// Custom hook for form management following functional programming principles
export const useForm = <T extends FieldValues = FieldValues>(
  initialValues: T,
  validations: Record<string, FieldValidation> = {},
  submissionConfig?: FormSubmissionConfig,
  submissionService?: FormSubmissionService
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Memoized form state
  const formState: FormState<T> = useMemo(
    () => ({
      values,
      errors,
      isSubmitting,
      isDirty,
      isValid:
        Object.keys(errors).length === 0 && Object.keys(validations).length > 0
          ? validateForm(values, validations).isValid
          : true,
    }),
    [values, errors, isSubmitting, isDirty, validations]
  );

  // Set value function
  const setValue = useCallback(
    (name: string, value: unknown) => {
      setValues(prev => ({ ...prev, [name]: value }));
      setIsDirty(true);
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Set error function
  const setError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Clear error function
  const clearError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  // Clear all errors function
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Reset form function
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle change function
  const handleChange = useCallback(
    (name: string, value: unknown) => {
      setValue(name, value);
    },
    [setValue]
  );

  // Validate form function
  const validate = useCallback((): ValidationResult => {
    const result = validateForm(values, validations);
    setErrors(result.errors);
    return result;
  }, [values, validations]);

  // Submit form function
  const submit = useCallback(async (): Promise<FormSubmissionResult> => {
    if (!submissionConfig) {
      throw new Error('Submission configuration is required');
    }

    setIsSubmitting(true);
    clearErrors();

    try {
      // Validate form before submission
      const validationResult = validate();
      if (!validationResult.isValid) {
        setIsSubmitting(false);
        return {
          success: false,
          error: 'Form validation failed',
        };
      }

      // Use provided submission service or create default one
      const service = submissionService ?? createFormSubmissionService();
      const result = await service.submit(values, submissionConfig);

      setIsSubmitting(false);
      return result;
    } catch (error) {
      setIsSubmitting(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Submission failed',
      };
    }
  }, [values, submissionConfig, submissionService, validate, clearErrors]);

  return {
    formState,
    setValue,
    setError,
    clearError,
    clearErrors,
    reset,
    submit,
    validate,
    handleChange,
  };
};

// Specialized hook for login form
export const useLoginForm = (
  initialValues: { email: string; password: string } = {
    email: '',
    password: '',
  },
  submissionService?: FormSubmissionService
) => {
  const validations = {
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { required: true, minLength: 6 },
  };

  const submissionConfig: FormSubmissionConfig = {
    endpoint: '/api/login',
    method: 'GET',
  };

  return useForm(
    initialValues,
    validations,
    submissionConfig,
    submissionService
  );
};

// Specialized hook for register form
export const useRegisterForm = (
  initialValues: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  } = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  },
  submissionService?: FormSubmissionService
) => {
  const validations = {
    name: { required: true, minLength: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { pattern: /^[0-9+\-\s()]+$/ },
    password: { required: true, minLength: 6 },
    confirmPassword: {
      required: true,
      custom: () => {
        // This validation will be handled in the form component
        return null;
      },
    },
  };

  const submissionConfig: FormSubmissionConfig = {
    endpoint: '/api/register',
    method: 'POST',
  };

  return useForm(
    initialValues,
    validations,
    submissionConfig,
    submissionService
  );
};

// Hook for form field management
export const useFormField = <T = unknown>(
  _name: string,
  value: T,
  onChange: (value: T) => void,
  error?: string
) => {
  const handleChange = useCallback(
    (newValue: T) => {
      onChange(newValue);
    },
    [onChange]
  );

  const hasError = Boolean(error);

  return {
    value,
    onChange: handleChange,
    error,
    hasError,
  };
};
