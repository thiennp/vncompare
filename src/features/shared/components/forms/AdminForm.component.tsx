import React from 'react';
import { Button } from '../ui/button';
import { Form } from './Form.component';
import type { FormConfig } from '../../types/form.types';
import {
  AdminProductFormData,
  AdminUserFormData,
  AdminSupplierFormData,
  PRODUCT_FORM_FIELDS,
  USER_FORM_FIELDS,
  SUPPLIER_FORM_FIELDS,
  PRODUCT_FORM_VALIDATION,
  USER_FORM_VALIDATION,
  SUPPLIER_FORM_VALIDATION,
} from '../../types/admin-form.types';

// Admin Product Form Component
export const AdminProductForm: React.FC<{
  initialValues?: Partial<AdminProductFormData>;
  onSubmit?: (result: {
    success: boolean;
    data?: unknown;
    error?: string;
  }) => void;
  onError?: (error: string) => void;
  className?: string;
  submitLabel?: string;
}> = ({
  initialValues = {},
  onSubmit,
  onError,
  className = '',
  submitLabel = 'Tạo sản phẩm',
}) => {
  const config: FormConfig<AdminProductFormData> = {
    fields: PRODUCT_FORM_FIELDS,
    defaultValues: {
      name: '',
      brand: '',
      category: 'Sơn ngoại thất',
      description: '',
      price: 0,
      unit: 'lít',
      coverage: 0,
      isActive: true,
      ...initialValues,
    },
    validation: PRODUCT_FORM_VALIDATION,
    submission: {
      endpoint: '/api/admin/products',
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
        {submitLabel}
      </Button>
    </Form>
  );
};

// Admin User Form Component
export const AdminUserForm: React.FC<{
  initialValues?: Partial<AdminUserFormData>;
  onSubmit?: (result: {
    success: boolean;
    data?: unknown;
    error?: string;
  }) => void;
  onError?: (error: string) => void;
  className?: string;
  submitLabel?: string;
}> = ({
  initialValues = {},
  onSubmit,
  onError,
  className = '',
  submitLabel = 'Tạo người dùng',
}) => {
  const config: FormConfig<AdminUserFormData> = {
    fields: USER_FORM_FIELDS,
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      phone: '',
      ...initialValues,
    },
    validation: USER_FORM_VALIDATION,
    submission: {
      endpoint: '/api/admin/users',
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
        {submitLabel}
      </Button>
    </Form>
  );
};

// Admin Supplier Form Component
export const AdminSupplierForm: React.FC<{
  initialValues?: Partial<AdminSupplierFormData>;
  onSubmit?: (result: {
    success: boolean;
    data?: unknown;
    error?: string;
  }) => void;
  onError?: (error: string) => void;
  className?: string;
  submitLabel?: string;
}> = ({
  initialValues = {},
  onSubmit,
  onError,
  className = '',
  submitLabel = 'Tạo nhà cung cấp',
}) => {
  const config: FormConfig<AdminSupplierFormData> = {
    fields: SUPPLIER_FORM_FIELDS,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      verified: false,
      ...initialValues,
    },
    validation: SUPPLIER_FORM_VALIDATION,
    submission: {
      endpoint: '/api/admin/suppliers',
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
        {submitLabel}
      </Button>
    </Form>
  );
};

// Generic Admin Form Modal Component
export const AdminFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
