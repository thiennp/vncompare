export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  email?: boolean;
  phone?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationErrors {
  [key: string]: string;
}

export class Validator {
  private rules: { [key: string]: ValidationRule } = {};

  addRule(field: string, rule: ValidationRule) {
    this.rules[field] = rule;
    return this;
  }

  validate(data: any): { isValid: boolean; errors: ValidationErrors } {
    const errors: ValidationErrors = {};

    for (const field in this.rules) {
      const rule = this.rules[field];
      const value = data[field];
      const error = this.validateField(field, value, rule);
      
      if (error) {
        errors[field] = error;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  private validateField(field: string, value: any, rule: ValidationRule): string | null {
    // Required validation
    if (rule.required && (value === undefined || value === null || value === '')) {
      return `${this.getFieldLabel(field)} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!rule.required && (value === undefined || value === null || value === '')) {
      return null;
    }

    // String length validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return `${this.getFieldLabel(field)} must be at least ${rule.minLength} characters`;
      }
      
      if (rule.maxLength && value.length > rule.maxLength) {
        return `${this.getFieldLabel(field)} must be no more than ${rule.maxLength} characters`;
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        return `${this.getFieldLabel(field)} must be at least ${rule.min}`;
      }
      
      if (rule.max !== undefined && value > rule.max) {
        return `${this.getFieldLabel(field)} must be no more than ${rule.max}`;
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return `${this.getFieldLabel(field)} format is invalid`;
    }

    // Email validation
    if (rule.email && typeof value === 'string') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return `${this.getFieldLabel(field)} must be a valid email address`;
      }
    }

    // Phone validation
    if (rule.phone && typeof value === 'string') {
      const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phonePattern.test(value.replace(/[\s\-\(\)]/g, ''))) {
        return `${this.getFieldLabel(field)} must be a valid phone number`;
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }

  private getFieldLabel(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    email: true,
    maxLength: 255
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  phone: {
    required: false,
    phone: true
  },
  required: {
    required: true
  },
  optional: {
    required: false
  }
};

// Validation schemas for common forms
export const authValidation = new Validator()
  .addRule('email', commonRules.email)
  .addRule('password', commonRules.password)
  .addRule('name', commonRules.name)
  .addRule('phone', commonRules.phone);

export const productValidation = new Validator()
  .addRule('name', { required: true, minLength: 2, maxLength: 200 })
  .addRule('description', { required: true, minLength: 10, maxLength: 1000 })
  .addRule('basePrice', { required: true, min: 0 })
  .addRule('originalPrice', { required: false, min: 0 })
  .addRule('coverageRate', { required: true, min: 0 })
  .addRule('unit', { required: true, minLength: 1, maxLength: 10 })
  .addRule('brand', { required: true, minLength: 2, maxLength: 50 })
  .addRule('category', { required: true, minLength: 2, maxLength: 50 });

export const orderValidation = new Validator()
  .addRule('items', {
    required: true,
    custom: (value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return 'At least one item is required';
      }
      return null;
    }
  })
  .addRule('shippingAddress', {
    required: true,
    custom: (value) => {
      if (!value || typeof value !== 'object') {
        return 'Shipping address is required';
      }
      if (!value.name || !value.address) {
        return 'Name and address are required in shipping address';
      }
      return null;
    }
  });

export const reviewValidation = new Validator()
  .addRule('rating', {
    required: true,
    min: 1,
    max: 5,
    custom: (value) => {
      if (!Number.isInteger(value)) {
        return 'Rating must be a whole number';
      }
      return null;
    }
  })
  .addRule('title', { required: true, minLength: 5, maxLength: 100 })
  .addRule('comment', { required: true, minLength: 10, maxLength: 500 });

// Utility functions
export function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export function validatePhone(phone: string): boolean {
  const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
  return phonePattern.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
