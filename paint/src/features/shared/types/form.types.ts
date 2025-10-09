// Form types for paint project
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export interface FormValidation {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export interface FormSubmission {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export interface FormConfig<T = any> {
  fields: FormField[];
  defaultValues: T;
  validation: FormValidation;
  submission: FormSubmission;
}

export interface FormProps<T = any> {
  config: FormConfig<T>;
  onSubmit?: (result: { success: boolean; data?: unknown; error?: string }) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}