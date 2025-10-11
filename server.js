import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/vncompare';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://vncompare.vercel.app', 'https://www.vncompare.vercel.app']
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
let db;
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('vncompare');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email và mật khẩu là bắt buộc',
      });
    }

    // Check hardcoded admin credentials first
    if (email === 'nguyenphongthien@gmail.com' && password === 'Kimtuoc2') {
      const token = jwt.sign(
        {
          userId: 'admin-user-id',
          email: 'nguyenphongthien@gmail.com',
          role: 'admin',
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        user: {
          email: 'nguyenphongthien@gmail.com',
          name: 'Nguyen Phong Thien',
          role: 'admin',
        },
        token,
      });
    }

    // If not hardcoded user, check database
    const user = await db.collection('users').findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email hoặc mật khẩu không đúng',
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Email hoặc mật khẩu không đúng',
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Đăng nhập thất bại',
    });
  }
});

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await db
      .collection('products')
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await db.collection('products').countDocuments();

    res.json({
      products,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi lấy danh sách sản phẩm',
    });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      unit,
      coverage,
      isActive,
    } = req.body;

    if (!name || !brand || !price || !coverage) {
      return res.status(400).json({
        success: false,
        error: 'Thông tin bắt buộc không được để trống',
      });
    }

    const product = {
      name,
      brand,
      category: category || 'Sơn ngoại thất',
      description: description || '',
      price: parseFloat(price),
      unit: unit || 'lít',
      coverage: parseFloat(coverage),
      isActive: isActive !== false,
      images: [],
      specifications: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('products').insertOne(product);

    res.json({
      success: true,
      product: { ...product, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi tạo sản phẩm',
    });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      category,
      description,
      price,
      unit,
      coverage,
      isActive,
    } = req.body;

    const updateData = {
      name,
      brand,
      category,
      description,
      price: parseFloat(price),
      unit,
      coverage: parseFloat(coverage),
      isActive,
      updatedAt: new Date(),
    };

    const result = await db
      .collection('products')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi cập nhật sản phẩm',
    });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db
      .collection('products')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm',
      });
    }

    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi xóa sản phẩm',
    });
  }
});

// Orders endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const orders = await db
      .collection('orders')
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await db.collection('orders').countDocuments();

    res.json({
      orders,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi lấy danh sách đơn hàng',
    });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Trạng thái không được để trống',
      });
    }

    const result = await db
      .collection('orders')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy đơn hàng',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi cập nhật trạng thái đơn hàng',
    });
  }
});

// Users endpoints
app.get('/api/users', async (req, res) => {
  let client;
  try {
    // Ensure database connection for serverless environment
    if (!db) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db('vncompare');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await db
      .collection('users')
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await db.collection('users').countDocuments();

    res.json({
      users,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi lấy danh sách người dùng',
    });
  } finally {
    // Close connection in serverless environment
    if (client) {
      await client.close();
    }
  }
});

app.post('/api/users', async (req, res) => {
  let client;
  try {
    // Ensure database connection for serverless environment
    if (!db) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db('vncompare');
    }

    const { email, name, password, role } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email, tên và mật khẩu là bắt buộc',
      });
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email đã tồn tại',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      email,
      name,
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(user);

    res.json({
      success: true,
      user: { ...user, _id: result.insertedId, password: undefined },
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi tạo người dùng',
    });
  } finally {
    // Close connection in serverless environment
    if (client) {
      await client.close();
    }
  }
});

app.put('/api/users/:id', async (req, res) => {
  let client;
  try {
    // Ensure database connection for serverless environment
    if (!db) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db('vncompare');
    }

    const { id } = req.params;
    const { email, name, role } = req.body;

    const updateData = {
      email,
      name,
      role,
      updatedAt: new Date(),
    };

    const result = await db
      .collection('users')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy người dùng',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật người dùng thành công',
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi cập nhật người dùng',
    });
  } finally {
    // Close connection in serverless environment
    if (client) {
      await client.close();
    }
  }
});

app.delete('/api/users/:id', async (req, res) => {
  let client;
  try {
    // Ensure database connection for serverless environment
    if (!db) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db('vncompare');
    }

    const { id } = req.params;

    const result = await db
      .collection('users')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy người dùng',
      });
    }

    res.json({
      success: true,
      message: 'Xóa người dùng thành công',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi xóa người dùng',
    });
  } finally {
    // Close connection in serverless environment
    if (client) {
      await client.close();
    }
  }
});

// Suppliers endpoints
app.get('/api/suppliers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const suppliers = await db
      .collection('suppliers')
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await db.collection('suppliers').countDocuments();

    res.json({
      suppliers,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi lấy danh sách nhà cung cấp',
    });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const { name, email, phone, address, verified } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Tên và email là bắt buộc',
      });
    }

    // Check if supplier already exists
    const existingSupplier = await db
      .collection('suppliers')
      .findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({
        success: false,
        error: 'Email nhà cung cấp đã tồn tại',
      });
    }

    const supplier = {
      name,
      email,
      phone: phone || '',
      address: address || '',
      verified: verified || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('suppliers').insertOne(supplier);

    res.json({
      success: true,
      supplier: { ...supplier, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi tạo nhà cung cấp',
    });
  }
});

app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, verified } = req.body;

    const updateData = {
      name,
      email,
      phone,
      address,
      verified,
      updatedAt: new Date(),
    };

    const result = await db
      .collection('suppliers')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy nhà cung cấp',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật nhà cung cấp thành công',
    });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi cập nhật nhà cung cấp',
    });
  }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db
      .collection('suppliers')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy nhà cung cấp',
      });
    }

    res.json({
      success: true,
      message: 'Xóa nhà cung cấp thành công',
    });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi xóa nhà cung cấp',
    });
  }
});

// Reviews endpoints
app.get('/api/reviews', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const reviews = await db
      .collection('reviews')
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await db.collection('reviews').countDocuments();

    res.json({
      reviews,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi lấy danh sách đánh giá',
    });
  }
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const totalUsers = await db.collection('users').countDocuments();
    const totalProducts = await db.collection('products').countDocuments();
    const totalOrders = await db.collection('orders').countDocuments();
    const totalSuppliers = await db.collection('suppliers').countDocuments();

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalSuppliers,
      totalRevenue: 0, // TODO: Calculate from orders
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi lấy thống kê dashboard',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Reset database endpoint
app.post('/api/reset-db', async (req, res) => {
  try {
    // Only allow admin users to reset database
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Admin token required'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Admin role required'
      });
    }

    // Drop all collections
    const collections = ['users', 'products', 'orders', 'suppliers', 'reviews'];
    for (const collectionName of collections) {
      await db.collection(collectionName).drop().catch(() => {
        // Collection might not exist, ignore error
      });
    }

    // Recreate collections with indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('products').createIndex({ name: 1 });
    await db.collection('orders').createIndex({ userId: 1 });
    await db.collection('suppliers').createIndex({ email: 1 }, { unique: true });

    res.json({
      success: true,
      message: 'Database reset successfully'
    });
  } catch (error) {
    console.error('Reset database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset database'
    });
  }
});

// Start server
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
