// User and Authentication types
export interface User {
  _id?: string;
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  role: 'customer' | 'admin' | 'supplier';
  createdAt: string;
  lastLoginAt?: string;
  resetToken?: string;
  resetTokenExpiry?: string;
  isActive?: boolean;
}

export interface CreateUser {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role?: 'customer' | 'admin' | 'supplier';
  isActive?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role?: 'customer' | 'admin' | 'supplier';
}

// Product types
export interface Product {
  _id?: string;
  name: string;
  brand: string;
  category:
    | 'Exterior Paint'
    | 'Interior Paint'
    | 'Primer'
    | 'Varnish'
    | 'Stain'
    | 'Sealer';
  description?: string;
  price: number;
  unit: string;
  coverage: number;
  isActive?: boolean;
  createdAt: string;
  images?: string[];
  specifications?: Record<string, unknown>;
}

export interface CreateProduct {
  name: string;
  brand: string;
  category:
    | 'Exterior Paint'
    | 'Interior Paint'
    | 'Primer'
    | 'Varnish'
    | 'Stain'
    | 'Sealer';
  description?: string;
  price: number;
  unit: string;
  coverage: number;
  isActive?: boolean;
  images?: string[];
  specifications?: Record<string, unknown>;
}

// Supplier types
export interface Supplier {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isVerified?: boolean;
  createdAt: string;
  isActive?: boolean;
}

export interface CreateSupplier {
  name: string;
  email: string;
  phone: string;
  address: string;
  isVerified?: boolean;
  isActive?: boolean;
}

// Order types
export interface Order {
  _id?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrder {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

// Review types
export interface Review {
  _id?: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CreateReview {
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
}

// Address types
export interface Address {
  _id?: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault?: boolean;
  createdAt: string;
}

export interface CreateAddress {
  userId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault?: boolean;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Page data types
export interface HomePageData {
  featuredProducts: Product[];
  suppliers: Supplier[];
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalSuppliers: number;
  totalRevenue: number;
  activeProducts: number;
  verifiedSuppliers: number;
}

// Additional types for database-browser.ts
export interface Province {
  _id?: string;
  name: string;
  code: string;
  createdAt: string;
}

export interface District {
  _id?: string;
  name: string;
  code: string;
  provinceId: string;
  createdAt: string;
}

export interface Ward {
  _id?: string;
  name: string;
  code: string;
  districtId: string;
  createdAt: string;
}

export interface ProductCoverage {
  _id?: string;
  productId: string;
  area: number;
  unit: string;
  createdAt: string;
}

export interface ShippingZone {
  _id?: string;
  name: string;
  provinces: string[];
  shippingCost: number;
  createdAt: string;
}

export interface ServiceArea {
  _id?: string;
  supplierId: string;
  provinces: string[];
  districts: string[];
  createdAt: string;
}

// Type aliases for better readability
export type UserRole = 'customer' | 'admin' | 'supplier';
export type ProductCategory =
  | 'Exterior Paint'
  | 'Interior Paint'
  | 'Primer'
  | 'Varnish'
  | 'Stain'
  | 'Sealer';
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
