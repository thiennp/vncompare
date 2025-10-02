import { useState, useCallback } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useForm } from './useForm.hook';
import type {
  AdminProductFormData,
  AdminUserFormData,
  AdminSupplierFormData,
} from '../types/admin-form.types';
import {
  PRODUCT_FORM_VALIDATION,
  USER_FORM_VALIDATION,
  SUPPLIER_FORM_VALIDATION,
} from '../types/admin-form.types';
import { createFormSubmissionService } from '../services/form-submission.service';

// Admin Product Form Hook
export const useAdminProductForm = (
  initialValues: Partial<AdminProductFormData> = {},
  submissionService?: ReturnType<typeof createFormSubmissionService>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultValues: AdminProductFormData = {
    name: '',
    brand: '',
    category: 'Sơn ngoại thất',
    description: '',
    price: 0,
    unit: 'lít',
    coverage: 0,
    isActive: true,
    ...initialValues,
  };

  const form = useForm(
    defaultValues,
    PRODUCT_FORM_VALIDATION,
    {
      endpoint: '/api/admin/products',
      method: 'POST',
    },
    submissionService
  );

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await form.submit();
      if (result.success) {
        return result;
      } else {
        setError(result.error || 'Có lỗi xảy ra khi tạo sản phẩm');
        return result;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  const reset = useCallback(() => {
    form.reset();
    setError('');
    setIsLoading(false);
  }, [form]);

  return {
    ...form,
    isLoading,
    error,
    handleSubmit,
    reset,
  };
};

// Admin User Form Hook
export const useAdminUserForm = (
  initialValues: Partial<AdminUserFormData> = {},
  submissionService?: ReturnType<typeof createFormSubmissionService>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultValues: AdminUserFormData = {
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'customer',
    isActive: true,
    ...initialValues,
  };

  const form = useForm(
    defaultValues,
    USER_FORM_VALIDATION,
    {
      endpoint: '/api/admin/users',
      method: 'POST',
    },
    submissionService
  );

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await form.submit();
      if (result.success) {
        return result;
      } else {
        setError(result.error || 'Có lỗi xảy ra khi tạo người dùng');
        return result;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  const reset = useCallback(() => {
    form.reset();
    setError('');
    setIsLoading(false);
  }, [form]);

  return {
    ...form,
    isLoading,
    error,
    handleSubmit,
    reset,
  };
};

// Admin Supplier Form Hook
export const useAdminSupplierForm = (
  initialValues: Partial<AdminSupplierFormData> = {},
  submissionService?: ReturnType<typeof createFormSubmissionService>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultValues: AdminSupplierFormData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    isVerified: false,
    isActive: true,
    ...initialValues,
  };

  const form = useForm(
    defaultValues,
    SUPPLIER_FORM_VALIDATION,
    {
      endpoint: '/api/admin/suppliers',
      method: 'POST',
    },
    submissionService
  );

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await form.submit();
      if (result.success) {
        return result;
      } else {
        setError(result.error || 'Có lỗi xảy ra khi tạo nhà cung cấp');
        return result;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  const reset = useCallback(() => {
    form.reset();
    setError('');
    setIsLoading(false);
  }, [form]);

  return {
    ...form,
    isLoading,
    error,
    handleSubmit,
    reset,
  };
};

// Generic Admin Form Hook Factory
export const createAdminFormHook = <T extends FieldValues>(
  defaultValues: T,
  validation: Record<
    string,
    {
      required?: boolean;
      minLength?: number;
      pattern?: RegExp;
      custom?: (value: unknown) => string | null;
    }
  >,
  endpoint: string
) => {
  return (
    initialValues: Partial<T> = {},
    submissionService?: ReturnType<typeof createFormSubmissionService>
  ) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const form = useForm(
      { ...defaultValues, ...initialValues },
      validation,
      {
        endpoint,
        method: 'POST',
      },
      submissionService
    );

    const handleSubmit = useCallback(async () => {
      setIsLoading(true);
      setError('');

      try {
        const result = await form.submit();
        if (result.success) {
          return result;
        } else {
          setError(result.error || 'Có lỗi xảy ra');
          return result;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    }, [form]);

    const reset = useCallback(() => {
      form.reset();
      setError('');
      setIsLoading(false);
    }, [form]);

    return {
      ...form,
      isLoading,
      error,
      handleSubmit,
      reset,
    };
  };
};
