import { getDatabase } from './mongodb';
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
import { ObjectId } from 'mongodb';

export class DatabaseService {
  private db: any;

  constructor() {
    this.init();
  }

  private async init() {
    this.db = await getDatabase();
  }

  // User operations
  async createUser(userData: Omit<User, '_id' | 'createdAt'>): Promise<User> {
    const user: User = {
      ...userData,
      createdAt: new Date(),
    };
    const result = await this.db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.db.collection('users').findOne({ email });
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.db.collection('users').findOne({ _id: new ObjectId(id) });
  }

  async updateUser(
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> {
    const result = await this.db
      .collection('users')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    return result;
  }

  // Product operations
  async getProducts(
    filters: any = {},
    page = 1,
    limit = 20
  ): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;
    const products = await this.db
      .collection('products')
      .find(filters)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await this.db.collection('products').countDocuments(filters);

    return { products, total };
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.db
      .collection('products')
      .findOne({ _id: new ObjectId(id) });
  }

  async createProduct(
    productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<Product> {
    const product: Product = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await this.db.collection('products').insertOne(product);
    return { ...product, _id: result.insertedId };
  }

  async updateProduct(
    id: string,
    updateData: Partial<Product>
  ): Promise<Product | null> {
    const result = await this.db
      .collection('products')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
    return result;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.db
      .collection('products')
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Order operations
  async getOrders(
    userId?: string,
    filters: any = {},
    page = 1,
    limit = 20
  ): Promise<{ orders: Order[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = userId
      ? { userId: new ObjectId(userId), ...filters }
      : filters;

    const orders = await this.db
      .collection('orders')
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    const total = await this.db.collection('orders').countDocuments(query);

    return { orders, total };
  }

  async getOrderById(id: string): Promise<Order | null> {
    return await this.db
      .collection('orders')
      .findOne({ _id: new ObjectId(id) });
  }

  async createOrder(
    orderData: Omit<Order, '_id' | 'createdAt'>
  ): Promise<Order> {
    const order: Order = {
      ...orderData,
      createdAt: new Date(),
    };
    const result = await this.db.collection('orders').insertOne(order);
    return { ...order, _id: result.insertedId };
  }

  async updateOrder(
    id: string,
    updateData: Partial<Order>
  ): Promise<Order | null> {
    const result = await this.db
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
    filters: any = {},
    page = 1,
    limit = 20
  ): Promise<{ suppliers: Supplier[]; total: number }> {
    const skip = (page - 1) * limit;
    const suppliers = await this.db
      .collection('suppliers')
      .find(filters)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await this.db.collection('suppliers').countDocuments(filters);

    return { suppliers, total };
  }

  async getSupplierById(id: string): Promise<Supplier | null> {
    return await this.db
      .collection('suppliers')
      .findOne({ _id: new ObjectId(id) });
  }

  async createSupplier(
    supplierData: Omit<Supplier, '_id' | 'createdAt'>
  ): Promise<Supplier> {
    const supplier: Supplier = {
      ...supplierData,
      createdAt: new Date(),
    };
    const result = await this.db.collection('suppliers').insertOne(supplier);
    return { ...supplier, _id: result.insertedId };
  }

  async updateSupplier(
    id: string,
    updateData: Partial<Supplier>
  ): Promise<Supplier | null> {
    const result = await this.db
      .collection('suppliers')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    return result;
  }

  // Review operations
  async getReviews(
    productId?: string,
    filters: any = {},
    page = 1,
    limit = 20
  ): Promise<{ reviews: Review[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = productId
      ? { productId: new ObjectId(productId), ...filters }
      : filters;

    const reviews = await this.db
      .collection('reviews')
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    const total = await this.db.collection('reviews').countDocuments(query);

    return { reviews, total };
  }

  async createReview(
    reviewData: Omit<Review, '_id' | 'createdAt'>
  ): Promise<Review> {
    const review: Review = {
      ...reviewData,
      createdAt: new Date(),
    };
    const result = await this.db.collection('reviews').insertOne(review);
    return { ...review, _id: result.insertedId };
  }

  async updateReview(
    id: string,
    updateData: Partial<Review>
  ): Promise<Review | null> {
    const result = await this.db
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
    return await this.db
      .collection('addresses')
      .find({ userId: new ObjectId(userId) })
      .sort({ isDefault: -1, createdAt: -1 })
      .toArray();
  }

  async createAddress(
    addressData: Omit<Address, '_id' | 'createdAt'>
  ): Promise<Address> {
    const address: Address = {
      ...addressData,
      createdAt: new Date(),
    };
    const result = await this.db.collection('addresses').insertOne(address);
    return { ...address, _id: result.insertedId };
  }

  async updateAddress(
    id: string,
    updateData: Partial<Address>
  ): Promise<Address | null> {
    const result = await this.db
      .collection('addresses')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
    return result;
  }

  async deleteAddress(id: string): Promise<boolean> {
    const result = await this.db
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
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalSuppliers,
      revenueResult,
      pendingOrders,
      pendingReviews,
    ] = await Promise.all([
      this.db.collection('users').countDocuments(),
      this.db.collection('products').countDocuments(),
      this.db.collection('orders').countDocuments(),
      this.db.collection('suppliers').countDocuments(),
      this.db
        .collection('orders')
        .aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ])
        .toArray(),
      this.db.collection('orders').countDocuments({ status: 'pending' }),
      this.db.collection('reviews').countDocuments({ status: 'pending' }),
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
    return await this.db.collection('provinces').find().toArray();
  }

  async getDistricts(provinceId: string): Promise<District[]> {
    return await this.db
      .collection('districts')
      .find({ provinceId: new ObjectId(provinceId) })
      .toArray();
  }

  async getWards(districtId: string): Promise<Ward[]> {
    return await this.db
      .collection('wards')
      .find({ districtId: new ObjectId(districtId) })
      .toArray();
  }
}

export const db = new DatabaseService();
