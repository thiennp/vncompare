// Admin form types for paint project
export interface AdminProductFormData {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  coverage: number;
  isActive: boolean;
}

export interface AdminUserFormData {
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export interface AdminSupplierFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  verified: boolean;
}

export const PRODUCT_FORM_FIELDS = [
  {
    name: 'name',
    label: 'Tên sản phẩm',
    type: 'text' as const,
    required: true,
  },
  {
    name: 'brand',
    label: 'Thương hiệu',
    type: 'text' as const,
    required: true,
  },
  {
    name: 'category',
    label: 'Danh mục',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'Sơn ngoại thất', label: 'Sơn ngoại thất' },
      { value: 'Sơn nội thất', label: 'Sơn nội thất' },
    ],
  },
  { name: 'description', label: 'Mô tả', type: 'textarea' as const },
  { name: 'price', label: 'Giá', type: 'number' as const, required: true },
  { name: 'unit', label: 'Đơn vị', type: 'text' as const, required: true },
  {
    name: 'coverage',
    label: 'Diện tích phủ',
    type: 'number' as const,
    required: true,
  },
  { name: 'isActive', label: 'Hoạt động', type: 'checkbox' as const },
];

export const USER_FORM_FIELDS = [
  { name: 'name', label: 'Tên', type: 'text' as const, required: true },
  { name: 'email', label: 'Email', type: 'email' as const, required: true },
  {
    name: 'role',
    label: 'Vai trò',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'user', label: 'Người dùng' },
      { value: 'admin', label: 'Quản trị' },
    ],
  },
  { name: 'phone', label: 'Số điện thoại', type: 'text' as const },
];

export const SUPPLIER_FORM_FIELDS = [
  {
    name: 'name',
    label: 'Tên nhà cung cấp',
    type: 'text' as const,
    required: true,
  },
  { name: 'email', label: 'Email', type: 'email' as const, required: true },
  {
    name: 'phone',
    label: 'Số điện thoại',
    type: 'text' as const,
    required: true,
  },
  {
    name: 'address',
    label: 'Địa chỉ',
    type: 'textarea' as const,
    required: true,
  },
  { name: 'verified', label: 'Đã xác minh', type: 'checkbox' as const },
];

export const PRODUCT_FORM_VALIDATION = {
  name: { required: true, minLength: 2 },
  brand: { required: true, minLength: 2 },
  category: { required: true },
  price: { required: true, minLength: 1 },
  unit: { required: true },
  coverage: { required: true, minLength: 1 },
};

export const USER_FORM_VALIDATION = {
  name: { required: true, minLength: 2 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  role: { required: true },
};

export const SUPPLIER_FORM_VALIDATION = {
  name: { required: true, minLength: 2 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { required: true, minLength: 10 },
  address: { required: true, minLength: 10 },
};
