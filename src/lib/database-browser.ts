// Browser-compatible database service using localStorage
import {
  User,
  Product,
  Order,
  Supplier,
  Review,
  Address,
  Province,
  CreateUser,
} from '../types';
import { isCreateUser } from '../types/guards';

// Simple ID generator
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize with sample data if collections are empty
    if (this.getUsersCollection().length === 0) {
      this.seedSampleData();
    }
  }

  private seedSampleData() {
    // Sample users with hashed passwords (same as MongoDB)
    const users: User[] = [
      {
        _id: generateId(),
        email: 'nguyenphongthien@gmail.com',
        password: btoa('Kimtuoc2' + 'your-super-secret-jwt-key-for-development-only'), // Hashed password
        name: 'Nguyen Phong Thien',
        role: 'admin',
        createdAt: new Date().toISOString(),
        isActive: true,
      },
      {
        _id: generateId(),
        email: 'customer@example.com',
        password: btoa('customer123' + 'your-super-secret-jwt-key-for-development-only'), // Hashed password
        name: 'Customer User',
        role: 'customer',
        createdAt: new Date().toISOString(),
        isActive: true,
      },
    ];

    // Sample products
    const products: Product[] = [
      {
        _id: generateId(),
        name: 'Dulux Weathershield',
        brand: 'Dulux',
        category: 'Exterior Paint',
        description: 'High-quality exterior paint for all weather conditions',
        price: 450000,
        unit: 'thùng',
        coverage: 12,
        isActive: true,
        createdAt: new Date().toISOString(),
        images: ['/images/dulux-weathershield.jpg'],
        specifications: {
          color: 'White',
          finish: 'Matte',
          durability: '5 years',
        },
      },
      {
        _id: generateId(),
        name: 'Jotun Lady',
        brand: 'Jotun',
        category: 'Interior Paint',
        description: 'Premium interior paint with excellent coverage',
        price: 320000,
        unit: 'thùng',
        coverage: 15,
        isActive: true,
        createdAt: new Date().toISOString(),
        images: ['/images/jotun-lady.jpg'],
        specifications: {
          color: 'White',
          finish: 'Satin',
          durability: '3 years',
        },
      },
    ];

    // Sample suppliers
    const suppliers: Supplier[] = [
      {
        _id: generateId(),
        name: 'Công ty TNHH Sơn Dulux',
        email: 'contact@dulux.vn',
        phone: '0123456789',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        isVerified: true,
        createdAt: new Date().toISOString(),
        isActive: true,
      },
      {
        _id: generateId(),
        name: 'Jotun Vietnam',
        email: 'info@jotun.vn',
        phone: '0987654321',
        address: '456 Lê Lợi, Q1, TP.HCM',
        isVerified: true,
        createdAt: new Date().toISOString(),
        isActive: true,
      },
    ];

    // Save sample data
    saveCollection(this.collections.users, users);
    saveCollection(this.collections.products, products);
    saveCollection(this.collections.suppliers, suppliers);
  }

  // User operations
  async createUser(userData: CreateUser): Promise<User> {
    // Validate input data with generated type guard
    if (
      !isCreateUser(userData, {
        identifier: 'CreateUser',
        callbackOnError: console.error,
        errorMode: 'json',
      })
    ) {
      throw new Error('Invalid user data');
    }

    const user: User = {
      ...userData,
      role: userData.role || 'customer', // Default to customer if not specified
      _id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const users = this.getUsersCollection();
    users.push(user);
    saveCollection(this.collections.users, users);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = this.getUsersCollection();
    return users.find(user => user.email === email) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    const users = this.getUsersCollection();
    return users.find(user => user._id === id) || null;
  }

  async updateUser(
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> {
    const users = this.getUsersCollection();
    const index = users.findIndex(user => user._id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updateData };
    saveCollection(this.collections.users, users);
    return users[index];
  }

  async getUsers(
    filters: Record<string, unknown> = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ users: User[]; total: number }> {
    let users = this.getUsersCollection();

    // Apply filters
    if (filters.role) {
      users = users.filter(user => user.role === filters.role);
    }
    if (filters.isActive !== undefined) {
      users = users.filter(user => user.isActive === filters.isActive);
    }

    const total = users.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    return { users: paginatedUsers, total };
  }

  // Product operations
  async createProduct(
    productData: Omit<Product, '_id' | 'createdAt'>
  ): Promise<Product> {
    const product: Product = {
      ...productData,
      _id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const products = this.getProductsCollection();
    products.push(product);
    saveCollection(this.collections.products, products);
    return product;
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = this.getProductsCollection();
    return products.find(product => product._id === id) || null;
  }

  async getProducts(
    filters: Record<string, unknown> = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ products: Product[]; total: number }> {
    let products = this.getProductsCollection();

    // Apply filters
    if (filters.isActive !== undefined) {
      products = products.filter(
        product => product.isActive === filters.isActive
      );
    }
    if (filters.category) {
      products = products.filter(
        product => product.category === filters.category
      );
    }
    if (filters.$or) {
      products = products.filter(product =>
        (filters.$or as Record<string, unknown>[]).some((condition: Record<string, unknown>) =>
          Object.keys(condition).some(key =>
            product[key as keyof Product]
              ?.toString()
              .toLowerCase()
              .includes((condition[key] as { $regex: string }).$regex.toLowerCase())
          )
        )
      );
    }

    const total = products.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return { products: paginatedProducts, total };
  }

  async updateProduct(
    id: string,
    updateData: Partial<Product>
  ): Promise<Product | null> {
    const products = this.getProductsCollection();
    const index = products.findIndex(product => product._id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updateData };
    saveCollection(this.collections.products, products);
    return products[index];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const products = this.getProductsCollection();
    const filteredProducts = products.filter(product => product._id !== id);
    if (filteredProducts.length === products.length) return false;

    saveCollection(this.collections.products, filteredProducts);
    return true;
  }

  // Supplier operations
  async createSupplier(
    supplierData: Omit<Supplier, '_id' | 'createdAt'>
  ): Promise<Supplier> {
    const supplier: Supplier = {
      ...supplierData,
      _id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const suppliers = this.getSuppliersCollection();
    suppliers.push(supplier);
    saveCollection(this.collections.suppliers, suppliers);
    return supplier;
  }

  async getSuppliers(
    filters: Record<string, unknown> = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ suppliers: Supplier[]; total: number }> {
    let suppliers = this.getSuppliersCollection();

    // Apply filters
    if (filters.isVerified !== undefined) {
      suppliers = suppliers.filter(
        supplier => supplier.isVerified === filters.isVerified
      );
    }
    if (filters.isActive !== undefined) {
      suppliers = suppliers.filter(
        supplier => supplier.isActive === filters.isActive
      );
    }

    const total = suppliers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSuppliers = suppliers.slice(startIndex, endIndex);

    return { suppliers: paginatedSuppliers, total };
  }

  async updateSupplier(
    id: string,
    updateData: Partial<Supplier>
  ): Promise<Supplier | null> {
    const suppliers = this.getSuppliersCollection();
    const index = suppliers.findIndex(supplier => supplier._id === id);
    if (index === -1) return null;

    suppliers[index] = { ...suppliers[index], ...updateData };
    saveCollection(this.collections.suppliers, suppliers);
    return suppliers[index];
  }

  // Order operations
  async createOrder(
    orderData: Omit<Order, '_id' | 'createdAt'>
  ): Promise<Order> {
    const order: Order = {
      ...orderData,
      _id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const orders = this.getOrdersCollection();
    orders.push(order);
    saveCollection(this.collections.orders, orders);
    return order;
  }

  async getOrderById(id: string): Promise<Order | null> {
    const orders = this.getOrdersCollection();
    return orders.find(order => order._id === id) || null;
  }

  async getOrders(
    userId?: string,
    filters: Record<string, unknown> = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ orders: Order[]; total: number }> {
    let orders = this.getOrdersCollection();

    // Filter by user if provided
    if (userId) {
      orders = orders.filter(order => order.userId === userId);
    }

    // Apply filters
    if (filters.status) {
      orders = orders.filter(order => order.status === filters.status);
    }

    const total = orders.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    return { orders: paginatedOrders, total };
  }

  async updateOrder(
    id: string,
    updateData: Partial<Order>
  ): Promise<Order | null> {
    const orders = this.getOrdersCollection();
    const index = orders.findIndex(order => order._id === id);
    if (index === -1) return null;

    orders[index] = { ...orders[index], ...updateData };
    saveCollection(this.collections.orders, orders);
    return orders[index];
  }

  // Review operations
  async createReview(
    reviewData: Omit<Review, '_id' | 'createdAt'>
  ): Promise<Review> {
    const review: Review = {
      ...reviewData,
      _id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const reviews = this.getReviewsCollection();
    reviews.push(review);
    saveCollection(this.collections.reviews, reviews);
    return review;
  }

  async getReviews(
    productId?: string,
    filters: Record<string, unknown> = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{ reviews: Review[]; total: number }> {
    let reviews = this.getReviewsCollection();

    // Filter by product if provided
    if (productId) {
      reviews = reviews.filter(review => review.productId === productId);
    }

    // Apply filters
    if (filters.status) {
      reviews = reviews.filter(review => review.status === filters.status);
    }

    const total = reviews.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = reviews.slice(startIndex, endIndex);

    return { reviews: paginatedReviews, total };
  }

  async updateReview(
    id: string,
    updateData: Partial<Review>
  ): Promise<Review | null> {
    const reviews = this.getReviewsCollection();
    const index = reviews.findIndex(review => review._id === id);
    if (index === -1) return null;

    reviews[index] = { ...reviews[index], ...updateData };
    saveCollection(this.collections.reviews, reviews);
    return reviews[index];
  }

  // Address operations
  async createAddress(
    addressData: Omit<Address, '_id' | 'createdAt'>
  ): Promise<Address> {
    const address: Address = {
      ...addressData,
      _id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const addresses = this.getAddressesCollection();
    addresses.push(address);
    saveCollection(this.collections.addresses, addresses);
    return address;
  }

  async getAddresses(userId: string): Promise<Address[]> {
    const addresses = this.getAddressesCollection();
    return addresses.filter(address => address.userId === userId);
  }

  async updateAddress(
    id: string,
    updateData: Partial<Address>
  ): Promise<Address | null> {
    const addresses = this.getAddressesCollection();
    const index = addresses.findIndex(address => address._id === id);
    if (index === -1) return null;

    addresses[index] = { ...addresses[index], ...updateData };
    saveCollection(this.collections.addresses, addresses);
    return addresses[index];
  }

  async deleteAddress(id: string): Promise<boolean> {
    const addresses = this.getAddressesCollection();
    const filteredAddresses = addresses.filter(address => address._id !== id);
    if (filteredAddresses.length === addresses.length) return false;

    saveCollection(this.collections.addresses, filteredAddresses);
    return true;
  }

  // Province operations
  async getProvinces(): Promise<Province[]> {
    return getCollection<Province>(this.collections.provinces);
  }

  // Dashboard stats
  async getDashboardStats(): Promise<Record<string, unknown>> {
    const users = this.getUsersCollection();
    const products = this.getProductsCollection();
    const orders = this.getOrdersCollection();
    const suppliers = this.getSuppliersCollection();

    return {
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalSuppliers: suppliers.length,
      totalRevenue: orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      ),
      activeProducts: products.filter(p => p.isActive).length,
      verifiedSuppliers: suppliers.filter(s => s.isVerified).length,
    };
  }

  // Helper methods to get collections
  private getUsersCollection(): User[] {
    return getCollection<User>(this.collections.users);
  }

  private getProductsCollection(): Product[] {
    return getCollection<Product>(this.collections.products);
  }

  private getSuppliersCollection(): Supplier[] {
    return getCollection<Supplier>(this.collections.suppliers);
  }

  private getOrdersCollection(): Order[] {
    return getCollection<Order>(this.collections.orders);
  }

  private getReviewsCollection(): Review[] {
    return getCollection<Review>(this.collections.reviews);
  }

  private getAddressesCollection(): Address[] {
    return getCollection<Address>(this.collections.addresses);
  }

  // Reset all data
  async resetDatabase(): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
      this.initializeSampleData();
    }
  }
}

export const db = new DatabaseService();
