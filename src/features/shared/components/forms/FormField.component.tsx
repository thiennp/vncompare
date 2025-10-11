import React from 'react';

interface FormFieldProps {
  field: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
  };
  value: any;
  error?: string;
  onChange: (value: any) => void;
  disabled?: boolean;
}

export function FormField({
  field,
  value,
  error,
  onChange,
  disabled,
}: FormFieldProps) {
  const renderInput = () => {
    switch (field.type) {
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-paint-orange/20 focus:border-paint-orange"
          >
            <option value="">Chọn {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-paint-orange/20 focus:border-paint-orange"
            rows={3}
          />
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={e => onChange(e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 text-paint-orange focus:ring-paint-orange border-gray-300 rounded"
          />
        );
      default:
        return (
          <input
            type={field.type}
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-paint-orange/20 focus:border-paint-orange"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function FormError({ error }: { error: string }) {
  return (
    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
      {error}
    </div>
  );
}

export function FormLoading({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-paint-orange"></div>
      </div>
    );
  }
  return <>{children}</>;
}
