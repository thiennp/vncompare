// Browser-compatible database service using localStorage
import {
  User,
  Product,
  Order,
  Supplier,
  Review,
  Address,
  Province,
  District,
  Ward,
  CreateUser,
} from '../types';
import { isCreateUser } from '../types/guards';

// Simple ID generator
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Helper functions for localStorage
function getCollection<T>(collectionName: string): T[] {
  try {
    const data = localStorage.getItem(collectionName);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${collectionName}:`, error);
    return [];
  }
}

function saveCollection<T>(collectionName: string, data: T[]): void {
  try {
    localStorage.setItem(collectionName, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${collectionName}:`, error);
  }
}

export class DatabaseService {
  private collections = {
    users: 'vncompare_users',
    products: 'vncompare_products',
    orders: 'vncompare_orders',
    suppliers: 'vncompare_suppliers',
    reviews: 'vncompare_reviews',
    addresses: 'vncompare_addresses',
    provinces: 'vncompare_provinces',
    districts: 'vncompare_districts',
    wards: 'vncompare_wards',
    productCoverages: 'vncompare_product_coverages',
    shippingZones: 'vncompare_shipping_zones',
    serviceAreas: 'vncompare_service_areas',
  };

  constructor() {
    this.initializeSampleData();
  }

  // Method to clear all data and reseed
  clearAllData(): void {
    Object.values(this.collections).forEach(collectionName => {
      localStorage.removeItem(collectionName);
    });
  }

  // Initialize with sample data if collections are empty
  private initializeSampleData(): void {
    const users = getCollection<User>(this.collections.users);
    if (users.length === 0) {
      const sampleUsers: User[] = [
        {
          _id: generateId(),
          email: 'admin@vncompare.com',
          password: btoa('admin123' + 'your-super-secret-jwt-key-for-development-only'),
          name: 'Admin User',
          phone: '0123456789',
          role: 'admin',
          createdAt: new Date().toISOString(),
          isActive: true,
        },
        {
          _id: generateId(),
          email: 'customer@vncompare.com',
          password: btoa('customer123' + 'your-super-secret-jwt-key-for-development-only'),
          name: 'Test Customer',
          phone: '0987654321',
          role: 'customer',
          createdAt: new Date().toISOString(),
          isActive: true,
        },
      ];
      saveCollection(this.collections.users, sampleUsers);
    }
  }

  // User methods
  async findUserByEmail(email: string): Promise<User | null> {
    const users = getCollection<User>(this.collections.users);
    return users.find(user => user.email === email) || null;
  }

  async createUser(userData: CreateUser): Promise<User> {
    if (!isCreateUser(userData)) {
      throw new Error('Invalid user data');
    }

    const users = getCollection<User>(this.collections.users);
    const newUser: User = {
      _id: generateId(),
      ...userData,
      role: userData.role || 'customer',
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    
    users.push(newUser);
    saveCollection(this.collections.users, users);
    return newUser;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const users = getCollection<User>(this.collections.users);
    const userIndex = users.findIndex(user => user._id === userId);
    
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    saveCollection(this.collections.users, users);
    return users[userIndex];
  }

  // Product methods
  async getProducts(filters: Record<string, unknown> = {}, page: number = 1, limit: number = 20): Promise<{ products: Product[]; total: number }> {
    const products = getCollection<Product>(this.collections.products);
    // Simple filtering - in a real app, you'd implement proper filtering
    const filteredProducts = products.filter(product => {
      if (filters.isActive !== undefined && product.isActive !== filters.isActive) return false;
      if (filters.category && product.category !== filters.category) return false;
      return true;
    });
    
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
    
    return {
      products: paginatedProducts,
      total: filteredProducts.length,
    };
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = getCollection<Product>(this.collections.products);
    return products.find(product => product._id === id) || null;
  }

  // Supplier methods
  async getSuppliers(filters: Record<string, unknown> = {}, page: number = 1, limit: number = 20): Promise<{ suppliers: Supplier[]; total: number }> {
    const suppliers = getCollection<Supplier>(this.collections.suppliers);
    const filteredSuppliers = suppliers.filter(supplier => {
      if (filters.isVerified !== undefined && supplier.isVerified !== filters.isVerified) return false;
      return true;
    });
    
    const startIndex = (page - 1) * limit;
    const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + limit);
    
    return {
      suppliers: paginatedSuppliers,
      total: filteredSuppliers.length,
    };
  }

  // Review methods
  async getReviews(filters: Record<string, unknown> = {}, options: Record<string, unknown> = {}, page: number = 1, limit: number = 20): Promise<{ reviews: Review[]; total: number }> {
    const reviews = getCollection<Review>(this.collections.reviews);
    const filteredReviews = reviews.filter(review => {
      if (options.status && review.status !== options.status) return false;
      return true;
    });
    
    const startIndex = (page - 1) * limit;
    const paginatedReviews = filteredReviews.slice(startIndex, startIndex + limit);
    
    return {
      reviews: paginatedReviews,
      total: filteredReviews.length,
    };
  }

  // Order methods
  async getOrders(filters: Record<string, unknown> = {}, page: number = 1, limit: number = 20): Promise<{ orders: Order[]; total: number }> {
    const orders = getCollection<Order>(this.collections.orders);
    const filteredOrders = orders.filter(order => {
      if (filters.userId && order.userId !== filters.userId) return false;
      return true;
    });
    
    const startIndex = (page - 1) * limit;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);
    
    return {
      orders: paginatedOrders,
      total: filteredOrders.length,
    };
  }

  async getOrderById(id: string): Promise<Order | null> {
    const orders = getCollection<Order>(this.collections.orders);
    return orders.find(order => order._id === id) || null;
  }

  // Address methods
  async getAddresses(filters: Record<string, unknown> = {}): Promise<Address[]> {
    const addresses = getCollection<Address>(this.collections.addresses);
    return addresses.filter(address => {
      if (filters.userId && address.userId !== filters.userId) return false;
      return true;
    });
  }

  // Location methods
  async getProvinces(): Promise<Province[]> {
    return getCollection<Province>(this.collections.provinces);
  }

  async getDistricts(provinceId?: string): Promise<District[]> {
    const districts = getCollection<District>(this.collections.districts);
    if (provinceId) {
      return districts.filter(district => district.provinceId === provinceId);
    }
    return districts;
  }

  async getWards(districtId?: string): Promise<Ward[]> {
    const wards = getCollection<Ward>(this.collections.wards);
    if (districtId) {
      return wards.filter(ward => ward.districtId === districtId);
    }
    return wards;
  }

  // Additional methods needed by the application
  async findUserById(id: string): Promise<User | null> {
    const users = getCollection<User>(this.collections.users);
    return users.find(user => user._id === id) || null;
  }

  async getUsers(filters: Record<string, unknown> = {}, page: number = 1, limit: number = 20): Promise<{ users: User[]; total: number }> {
    const users = getCollection<User>(this.collections.users);
    const filteredUsers = users.filter(user => {
      if (filters.role && user.role !== filters.role) return false;
      if (filters.isActive !== undefined && user.isActive !== filters.isActive) return false;
      return true;
    });
    
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);
    
    return {
      users: paginatedUsers,
      total: filteredUsers.length,
    };
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalSuppliers: number;
  }> {
    const users = getCollection<User>(this.collections.users);
    const products = getCollection<Product>(this.collections.products);
    const orders = getCollection<Order>(this.collections.orders);
    const suppliers = getCollection<Supplier>(this.collections.suppliers);

    return {
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalSuppliers: suppliers.length,
    };
  }
}

// Export singleton instance
export const db = new DatabaseService();
