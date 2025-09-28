// @ts-nocheck
import { getDatabase } from './mongodb.server';
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
} from './models';
import { ObjectId, Db } from 'mongodb';

export class DatabaseService {
  private db: Db | null = null;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.init();
  }

  private async init() {
    try {
      this.db = await getDatabase();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async ensureDb(): Promise<Db> {
    if (!this.db) {
      await this.initPromise;
      if (!this.db) {
        throw new Error('Database not initialized');
      }
    }
    return this.db;
  }

  // User operations
  async createUser(userData: Omit<User, '_id' | 'createdAt'>): Promise<User> {
    const db = await this.ensureDb();
    const user: User = {
      ...userData,
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const db = await this.ensureDb();
    return await db.collection('users').findOne({ email });
  }

  async findUserById(id: string): Promise<User | null> {
    const db = await this.ensureDb();
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
  }

  async updateUser(
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> {
    const db = await this.ensureDb();
    const result = await db
      .collection('users')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    return result;
  }

  async deleteUser(id: string): Promise<boolean> {
    const db = await this.ensureDb();
    const result = await db
      .collection('users')
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async getUsers(
    filters: Record<string, unknown> = {},
    page = 1,
    limit = 20
  ): Promise<{ users: User[]; total: number }> {
    const db = await this.ensureDb();
    const skip = (page - 1) * limit;
    const users = await db
      .collection('users')
      .find(filters)
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await db.collection('users').countDocuments(filters);
    return { users: users as User[], total };
  }

  // Product operations
  async getProducts(
    filters: Record<string, unknown> = {},
    page = 1,
    limit = 20
  ): Promise<{ products: Product[]; total: number }> {
    const db = await this.ensureDb();
    const skip = (page - 1) * limit;
    const products = await db
      .collection('products')
      .find(filters)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('products').countDocuments(filters);

    return { products, total };
  }

  async getProductById(id: string): Promise<Product | null> {
    const db = await this.ensureDb();
    return await db
      .collection('products')
      .findOne({ _id: new ObjectId(id) });
  }

  async createProduct(
    productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<Product> {
    const db = await this.ensureDb();
    const product: Product = {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await db.collection('products').insertOne(product);
    return { ...product, _id: result.insertedId };
  }

  async updateProduct(
    id: string,
    updateData: Partial<Product>
  ): Promise<Product | null> {
    const db = await this.ensureDb();
    const result = await db
      .collection('products')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
    return result;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const db = await this.ensureDb();
    const result = await db
      .collection('products')
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Order operations
  async getOrders(
    userId?: string,
    filters: Record<string, unknown> = {},
    page = 1,
    limit = 20
  ): Promise<{ orders: Order[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = userId
      ? { userId: new ObjectId(userId), ...filters }
      : filters;

    const db = await this.ensureDb();
    const orders = await db
      .collection('orders')
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    const total = await db.collection('orders').countDocuments(query);

    return { orders, total };
  }

  async getOrderById(id: string): Promise<Order | null> {
    const db = await this.ensureDb();
    return await db
      .collection('orders')
      .findOne({ _id: new ObjectId(id) });
  }

  async createOrder(
    orderData: Omit<Order, '_id' | 'createdAt'>
  ): Promise<Order> {
    const db = await this.ensureDb();
    const order: Order = {
      ...orderData,
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection('orders').insertOne(order);
    return { ...order, _id: result.insertedId };
  }

  async updateOrder(
    id: string,
    updateData: Partial<Order>
  ): Promise<Order | null> {
    const db = await this.ensureDb();
    const result = await db
      .collection('orders')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    return result;
  }

  // Supplier operations
  async getSuppliers(
    filters: Record<string, unknown> = {},
    page = 1,
    limit = 20
  ): Promise<{ suppliers: Supplier[]; total: number }> {
    const db = await this.ensureDb();
    const skip = (page - 1) * limit;
    const suppliers = await db
      .collection('suppliers')
      .find(filters)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('suppliers').countDocuments(filters);

    return { suppliers, total };
  }

  async getSupplierById(id: string): Promise<Supplier | null> {
    const db = await this.ensureDb();
    return await db
      .collection('suppliers')
      .findOne({ _id: new ObjectId(id) });
  }

  async createSupplier(
    supplierData: Omit<Supplier, '_id' | 'createdAt'>
  ): Promise<Supplier> {
    const db = await this.ensureDb();
    const supplier: Supplier = {
      ...supplierData,
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection('suppliers').insertOne(supplier);
    return { ...supplier, _id: result.insertedId };
  }

  async updateSupplier(
    id: string,
    updateData: Partial<Supplier>
  ): Promise<Supplier | null> {
    const db = await this.ensureDb();
    const result = await db
      .collection('suppliers')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    return result;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    const db = await this.ensureDb();
    const result = await db
      .collection('suppliers')
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Review operations
  async getReviews(
    productId?: string,
    filters: Record<string, unknown> = {},
    page = 1,
    limit = 20
  ): Promise<{ reviews: Review[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = productId
      ? { productId: new ObjectId(productId), ...filters }
      : filters;

    const db = await this.ensureDb();
    const reviews = await db
      .collection('reviews')
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    const total = await db.collection('reviews').countDocuments(query);

    return { reviews, total };
  }

  async createReview(
    reviewData: Omit<Review, '_id' | 'createdAt'>
  ): Promise<Review> {
    const db = await this.ensureDb();
    const review: Review = {
      ...reviewData,
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection('reviews').insertOne(review);
    return { ...review, _id: result.insertedId };
  }

  async updateReview(
    id: string,
    updateData: Partial<Review>
  ): Promise<Review | null> {
    const db = await this.ensureDb();
    const result = await db
      .collection('reviews')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    return result;
  }

  // Address operations
  async getAddresses(userId: string): Promise<Address[]> {
    const db = await this.ensureDb();
    return await db
      .collection('addresses')
      .find({ userId: new ObjectId(userId) })
      .sort({ isDefault: -1, createdAt: -1 })
      .toArray();
  }

  async createAddress(
    addressData: Omit<Address, '_id' | 'createdAt'>
  ): Promise<Address> {
    const db = await this.ensureDb();
    const address: Address = {
      ...addressData,
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection('addresses').insertOne(address);
    return { ...address, _id: result.insertedId };
  }

  async updateAddress(
    id: string,
    updateData: Partial<Address>
  ): Promise<Address | null> {
    const db = await this.ensureDb();
    const result = await db
      .collection('addresses')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    return result;
  }

  async deleteAddress(id: string): Promise<boolean> {
    const db = await this.ensureDb();
    const result = await db
      .collection('addresses')
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Analytics operations
  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalSuppliers: number;
    totalRevenue: number;
    pendingOrders: number;
    pendingReviews: number;
  }> {
    const db = await this.ensureDb();
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalSuppliers,
      revenueResult,
      pendingOrders,
      pendingReviews,
    ] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('products').countDocuments(),
      db.collection('orders').countDocuments(),
      db.collection('suppliers').countDocuments(),
      db
        .collection('orders')
        .aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ])
        .toArray(),
      db.collection('orders').countDocuments({ status: 'pending' }),
      db.collection('reviews').countDocuments({ status: 'pending' }),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalSuppliers,
      totalRevenue: revenueResult[0]?.total || 0,
      pendingOrders,
      pendingReviews,
    };
  }

  // Province/District/Ward operations
  async getProvinces(): Promise<Province[]> {
    const db = await this.ensureDb();
    return await db.collection('provinces').find().toArray();
  }

  async getDistricts(provinceId: string): Promise<District[]> {
    const db = await this.ensureDb();
    return await db
      .collection('districts')
      .find({ provinceId: new ObjectId(provinceId) })
      .toArray();
  }

  async getWards(districtId: string): Promise<Ward[]> {
    const db = await this.ensureDb();
    return await db
      .collection('wards')
      .find({ districtId: new ObjectId(districtId) })
      .toArray();
  }
}

// Create database instance
const dbService = new DatabaseService();

// Export the database service
export const db = dbService;
