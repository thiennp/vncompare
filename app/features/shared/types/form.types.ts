import React from 'react';
import type { FieldValues } from 'react-hook-form';

// Form field configuration types
export interface FormFieldConfig<T = unknown> {
  readonly name: string;
  readonly label: string;
  readonly type:
    | 'text'
    | 'email'
    | 'password'
    | 'tel'
    | 'number'
    | 'textarea'
    | 'select';
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly validation?: FieldValidation<T>;
  readonly options?: readonly SelectOption[];
}

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

// Validation types
export interface FieldValidation<T = unknown> {
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: RegExp;
  readonly custom?: (value: T) => string | null;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: Record<string, string>;
}

// Form state types
export interface FormState<T extends FieldValues = FieldValues> {
  readonly values: T;
  readonly errors: Record<string, string>;
  readonly isSubmitting: boolean;
  readonly isDirty: boolean;
  readonly isValid: boolean;
}

// Form submission types
export interface FormSubmissionResult<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

export interface FormSubmissionConfig {
  readonly endpoint: string;
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  readonly headers?: Record<string, string>;
}

// Form configuration types
export interface FormConfig<T extends FieldValues = FieldValues> {
  readonly fields: readonly FormFieldConfig[];
  readonly defaultValues: T;
  readonly validation?: Record<string, FieldValidation>;
  readonly submission: FormSubmissionConfig;
}

// Form hook types
export interface UseFormReturn<T extends FieldValues = FieldValues> {
  readonly formState: FormState<T>;
  readonly setValue: (name: string, value: unknown) => void;
  readonly setError: (name: string, error: string) => void;
  readonly clearError: (name: string) => void;
  readonly clearErrors: () => void;
  readonly reset: () => void;
  readonly submit: () => Promise<FormSubmissionResult>;
  readonly validate: () => ValidationResult;
  readonly handleChange: (name: string, value: unknown) => void;
}

// Form component props
export interface FormProps<T extends FieldValues = FieldValues> {
  readonly config: FormConfig<T>;
  readonly onSubmit?: (result: FormSubmissionResult) => void;
  readonly onError?: (error: string) => void;
  readonly className?: string;
  readonly children?: React.ReactNode;
}

export interface FormFieldProps {
  readonly field: FormFieldConfig;
  readonly value: unknown;
  readonly error?: string;
  readonly onChange: (value: unknown) => void;
  readonly disabled?: boolean;
}

// Common form field types
export interface LoginFormData {
  readonly email: string;
  readonly password: string;
}

export interface RegisterFormData {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly password: string;
  readonly confirmPassword: string;
}

export interface ProductFormData {
  readonly name: string;
  readonly brand: string;
  readonly category: string;
  readonly description: string;
  readonly price: number;
  readonly unit: string;
  readonly coverage: number;
  readonly isActive: boolean;
}

export interface UserFormData {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly phone: string;
  readonly role: string;
  readonly isActive: boolean;
}
