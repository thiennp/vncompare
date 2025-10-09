import type { FieldValidation, ValidationResult } from '../types/form.types';

// Pure validation functions following functional programming principles
export const createValidator = <T>(validation: FieldValidation<T>) => {
  return (value: T): string | null => {
    // Required validation
    if (
      validation.required &&
      (!value || (typeof value === 'string' && value.trim() === ''))
    ) {
      return 'Trường này là bắt buộc';
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Min length validation
    if (
      validation.minLength &&
      typeof value === 'string' &&
      value.length < validation.minLength
    ) {
      return `Tối thiểu ${validation.minLength} ký tự`;
    }

    // Max length validation
    if (
      validation.maxLength &&
      typeof value === 'string' &&
      value.length > validation.maxLength
    ) {
      return `Tối đa ${validation.maxLength} ký tự`;
    }

    // Pattern validation
    if (
      validation.pattern &&
      typeof value === 'string' &&
      !validation.pattern.test(value)
    ) {
      return 'Định dạng không hợp lệ';
    }

    // Custom validation
    if (validation.custom) {
      return validation.custom(value);
    }

    return null;
  };
};

// Email validation
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email không hợp lệ';
  }
  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  return null;
};

// Phone validation
export const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  if (!phoneRegex.test(phone)) {
    return 'Số điện thoại không hợp lệ';
  }
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (password !== confirmPassword) {
    return 'Mật khẩu xác nhận không khớp';
  }
  return null;
};

// Form validation
export const validateForm = <T extends Record<string, unknown>>(
  values: T,
  validations: Record<string, FieldValidation>
): ValidationResult => {
  const errors: Record<string, string> = {};

  Object.entries(validations).forEach(([fieldName, validation]) => {
    const validator = createValidator(validation);
    const error = validator(values[fieldName]);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Common validation rules
export const commonValidations = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: unknown) => validateEmail(value as string),
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: unknown) => validatePassword(value as string),
  },
  name: {
    required: true,
    minLength: 2,
  },
  phone: {
    custom: (value: unknown) => validatePhone(value as string),
  },
} as const;

// Validation factory for common field types
export const createFieldValidation = (
  type: keyof typeof commonValidations
): FieldValidation => {
  return commonValidations[type];
};
