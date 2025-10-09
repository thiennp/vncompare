// Mock database service for paint project
import { User, Product, Order, Supplier, Review } from './models';

// Mock data
const mockUsers: User[] = [
  {
    _id: '1',
    email: 'admin@paint.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: '2',
    email: 'user1@paint.com',
    name: 'John Doe',
    role: 'user',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Sơn ngoại thất cao cấp',
    brand: 'PaintPro',
    category: 'Sơn ngoại thất',
    description: 'Sơn chất lượng cao cho ngoại thất',
    price: 500000,
    unit: 'lít',
    coverage: 10,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: '2',
    name: 'Sơn nội thất bóng',
    brand: 'PaintPro',
    category: 'Sơn nội thất',
    description: 'Sơn nội thất bóng đẹp',
    price: 300000,
    unit: 'lít',
    coverage: 12,
    isActive: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

const mockOrders: Order[] = [
  {
    _id: '1',
    userId: '2',
    products: [
      { productId: '1', quantity: 2, price: 500000 },
    ],
    totalAmount: 1000000,
    status: 'pending',
    shippingAddress: '123 Main St, City',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

const mockSuppliers: Supplier[] = [
  {
    _id: '1',
    name: 'Paint Supply Co',
    email: 'contact@paintsupply.com',
    phone: '0123456789',
    address: '456 Supply St',
    verified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const mockReviews: Review[] = [
  {
    _id: '1',
    userId: '2',
    productId: '1',
    rating: 5,
    comment: 'Sản phẩm rất tốt!',
    status: 'pending',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];

export const db = {
  getUsers: async (filter: any = {}, page: number = 1, limit: number = 10) => {
    return {
      users: mockUsers,
      total: mockUsers.length,
      page,
      limit,
    };
  },

  getProducts: async (filter: any = {}, page: number = 1, limit: number = 10) => {
    return {
      products: mockProducts,
      total: mockProducts.length,
      page,
      limit,
    };
  },

  getOrders: async (userId?: string, filter: any = {}, page: number = 1, limit: number = 10) => {
    return {
      orders: mockOrders,
      total: mockOrders.length,
      page,
      limit,
    };
  },

  getSuppliers: async (filter: any = {}, page: number = 1, limit: number = 10) => {
    return {
      suppliers: mockSuppliers,
      total: mockSuppliers.length,
      page,
      limit,
    };
  },

  getReviews: async (userId?: string, filter: any = {}, page: number = 1, limit: number = 10) => {
    return {
      reviews: mockReviews,
      total: mockReviews.length,
      page,
      limit,
    };
  },
};