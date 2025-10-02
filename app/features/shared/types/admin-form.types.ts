import type { FieldValues } from 'react-hook-form';

// Admin form data types
export interface AdminProductFormData extends FieldValues {
  readonly name: string;
  readonly brand: string;
  readonly category: string;
  readonly description: string;
  readonly price: number;
  readonly unit: string;
  readonly coverage: number;
  readonly isActive: boolean;
}

export interface AdminUserFormData extends FieldValues {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly phone: string;
  readonly role: 'customer' | 'admin' | 'supplier';
  readonly isActive: boolean;
}

export interface AdminSupplierFormData extends FieldValues {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly isVerified: boolean;
  readonly isActive: boolean;
}

// Admin form field configurations
export const PRODUCT_FORM_FIELDS = [
  {
    name: 'name',
    label: 'Tên sản phẩm',
    type: 'text' as const,
    placeholder: 'Nhập tên sản phẩm',
    required: true,
  },
  {
    name: 'brand',
    label: 'Thương hiệu',
    type: 'text' as const,
    placeholder: 'Nhập thương hiệu',
    required: true,
  },
  {
    name: 'category',
    label: 'Danh mục',
    type: 'select' as const,
    placeholder: 'Chọn danh mục',
    required: true,
    options: [
      { value: 'Sơn ngoại thất', label: 'Sơn ngoại thất' },
      { value: 'Sơn nội thất', label: 'Sơn nội thất' },
      { value: 'Sơn lót', label: 'Sơn lót' },
      { value: 'Sơn bóng', label: 'Sơn bóng' },
      { value: 'Sơn màu', label: 'Sơn màu' },
      { value: 'Sơn chống thấm', label: 'Sơn chống thấm' },
    ],
  },
  {
    name: 'description',
    label: 'Mô tả',
    type: 'textarea' as const,
    placeholder: 'Nhập mô tả sản phẩm',
  },
  {
    name: 'price',
    label: 'Giá (VNĐ)',
    type: 'number' as const,
    placeholder: 'Nhập giá sản phẩm',
    required: true,
  },
  {
    name: 'unit',
    label: 'Đơn vị',
    type: 'select' as const,
    placeholder: 'Chọn đơn vị',
    required: true,
    options: [
      { value: 'lít', label: 'Lít' },
      { value: 'galông', label: 'Galông' },
      { value: 'lon', label: 'Lon' },
      { value: 'xô', label: 'Xô' },
      { value: 'tuýp', label: 'Tuýp' },
    ],
  },
  {
    name: 'coverage',
    label: 'Diện tích phủ (m²)',
    type: 'number' as const,
    placeholder: 'Nhập diện tích phủ',
    required: true,
  },
] as const;

export const USER_FORM_FIELDS = [
  {
    name: 'email',
    label: 'Email',
    type: 'email' as const,
    placeholder: 'Nhập email',
    required: true,
  },
  {
    name: 'password',
    label: 'Mật khẩu',
    type: 'password' as const,
    placeholder: 'Nhập mật khẩu',
    required: true,
  },
  {
    name: 'name',
    label: 'Họ và tên',
    type: 'text' as const,
    placeholder: 'Nhập họ và tên',
  },
  {
    name: 'phone',
    label: 'Số điện thoại',
    type: 'tel' as const,
    placeholder: 'Nhập số điện thoại',
  },
  {
    name: 'role',
    label: 'Vai trò',
    type: 'select' as const,
    placeholder: 'Chọn vai trò',
    required: true,
    options: [
      { value: 'customer', label: 'Khách hàng' },
      { value: 'supplier', label: 'Nhà cung cấp' },
      { value: 'admin', label: 'Quản trị viên' },
    ],
  },
] as const;

export const SUPPLIER_FORM_FIELDS = [
  {
    name: 'name',
    label: 'Tên nhà cung cấp',
    type: 'text' as const,
    placeholder: 'Nhập tên nhà cung cấp',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email' as const,
    placeholder: 'Nhập email',
    required: true,
  },
  {
    name: 'phone',
    label: 'Số điện thoại',
    type: 'tel' as const,
    placeholder: 'Nhập số điện thoại',
    required: true,
  },
  {
    name: 'address',
    label: 'Địa chỉ',
    type: 'textarea' as const,
    placeholder: 'Nhập địa chỉ',
    required: true,
  },
] as const;

// Admin form validation rules
export const PRODUCT_FORM_VALIDATION = {
  name: { required: true, minLength: 2 },
  brand: { required: true, minLength: 2 },
  category: { required: true },
  price: {
    required: true,
    custom: (value: unknown) =>
      typeof value === 'number' && value > 0 ? null : 'Giá phải lớn hơn 0',
  },
  unit: { required: true },
  coverage: {
    required: true,
    custom: (value: unknown) =>
      typeof value === 'number' && value > 0
        ? null
        : 'Diện tích phủ phải lớn hơn 0',
  },
} as const;

export const USER_FORM_VALIDATION = {
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { required: true, minLength: 6 },
  name: { minLength: 2 },
  phone: { pattern: /^[0-9+\-\s()]+$/ },
  role: { required: true },
} as const;

export const SUPPLIER_FORM_VALIDATION = {
  name: { required: true, minLength: 2 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { required: true, pattern: /^[0-9+\-\s()]+$/ },
  address: { required: true, minLength: 10 },
} as const;
