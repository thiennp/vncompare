// Mock data models for paint project
export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  description?: string;
  price?: number;
  basePrice?: number;
  originalPrice?: number;
  unit: string;
  coverage?: number;
  coverageRate?: number;
  isActive: boolean;
  supplierId?: string;
  agencyId?: string;
  sourceType?: 'supplier' | 'agency';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  _id?: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  products?: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  orderItems: OrderItem[];
  totalAmount: number;
  status:
    | 'pending'
    | 'processing'
    | 'confirmed'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Province {
  _id?: string;
  name: string;
  code: string;
}

export interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agency {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  level: 1 | 2 | 3;
  parentId?: string;
  parentType?: 'supplier' | 'agency';
  verified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  _id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  _id?: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  isDefault?: boolean;
  createdAt: string;
}
