// Browser-compatible models (using string IDs instead of MongoDB string)

// User and Authentication
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
}

// Vietnam Address System
export interface Province {
  _id?: string;
  code: string;
  name: string;
  type: string;
}

export interface District {
  _id?: string;
  provinceId: string;
  code: string;
  name: string;
  type: string;
}

export interface Ward {
  _id?: string;
  districtId: string;
  code: string;
  name: string;
  type: string;
}

// Products and Pricing
export interface Product {
  _id?: string;
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  basePrice?: number;
  originalPrice?: number;
  coverageRate?: number; // m²/liter
  unit?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCoverage {
  _id?: string;
  productId: string;
  surfaceType: string;
  coverageRate: number;
  coatsRequired: number;
  notes?: string;
}

// Suppliers and Service Areas
export interface Supplier {
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  businessInfo?: any;
  contactInfo?: any;
  isVerified: boolean;
  createdAt: string;
}

export interface ShippingZone {
  _id?: string;
  supplierId: string;
  zoneName: string;
  baseRate: number;
  weightFactor: number;
  distanceFactor: number;
  deliveryDays: number;
  isActive: boolean;
}

export interface ServiceArea {
  _id?: string;
  supplierId: string;
  provinceId: string;
  districtId?: string;
  wardId?: string;
  shippingZoneId: string;
  deliveryFee: number;
  deliveryDays: number;
}

// Orders and Analytics
export interface Order {
  _id?: string;
  userId: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  _id?: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

// Address Management
export interface Address {
  _id?: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  isDefault: boolean;
  createdAt: string;
}

// Product Reviews
export interface Review {
  _id?: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Database Collections
export interface DatabaseCollections {
  users: User;
  provinces: Province;
  districts: District;
  wards: Ward;
  products: Product;
  productCoverage: ProductCoverage;
  suppliers: Supplier;
  shippingZones: ShippingZone;
  serviceAreas: ServiceArea;
  orders: Order;
  orderItems: OrderItem;
  addresses: Address;
  reviews: Review;
}
