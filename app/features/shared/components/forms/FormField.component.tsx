import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import type { FormFieldProps } from '../../types/form.types';

// Form field component following Single Responsibility Principle
export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  onChange,
  disabled = false,
}) => {
  const renderInput = () => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: (value as string) || '',
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => onChange(e.target.value),
      placeholder: field.placeholder,
      required: field.required,
      disabled: disabled || field.disabled,
      'aria-invalid': Boolean(error),
      'aria-describedby': error ? `${field.name}-error` : undefined,
    };

    switch (field.type) {
      case 'email':
        return <Input {...commonProps} type="email" autoComplete="email" />;

      case 'password':
        return (
          <Input
            {...commonProps}
            type="password"
            autoComplete="current-password"
          />
        );

      case 'tel':
        return <Input {...commonProps} type="tel" autoComplete="tel" />;

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            onChange={e => onChange(Number(e.target.value))}
          />
        );

      case 'textarea':
        return <Textarea {...commonProps} rows={4} />;

      case 'select':
        return (
          <div>
            <select
              value={(value as string) || ''}
              onChange={e => onChange(e.target.value)}
              disabled={disabled || field.disabled}
              className="w-full p-2 border rounded-md"
            >
              <option value="">{field.placeholder}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return <Input {...commonProps} type="text" />;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {renderInput()}

      {error && (
        <p id={`${field.name}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

// Form error display component
export const FormError: React.FC<{ error: string }> = ({ error }) => (
  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
    {error}
  </div>
);

// Form loading state component
export const FormLoading: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
}> = ({ isLoading, children }) => (
  <fieldset disabled={isLoading}>{children}</fieldset>
);
