import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = 'mongodb://localhost:27017/vncompare';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

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
        error: 'Email và mật khẩu là bắt buộc' 
      });
    }

    // Find user
    const user = await db.collection('users').findOne({ email: email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Email hoặc mật khẩu không đúng' 
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Email hoặc mật khẩu không đúng' 
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
      error: 'Đăng nhập thất bại' 
    });
  }
});

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await db.collection('products').find({}).skip(skip).limit(limit).toArray();
    const total = await db.collection('products').countDocuments();

    res.json({
      products,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy danh sách sản phẩm' 
    });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, brand, category, description, price, unit, coverage, isActive } = req.body;

    if (!name || !brand || !price || !coverage) {
      return res.status(400).json({ 
        success: false, 
        error: 'Thông tin bắt buộc không được để trống' 
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
      updatedAt: new Date()
    };

    const result = await db.collection('products').insertOne(product);
    
    res.json({
      success: true,
      product: { ...product, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi tạo sản phẩm' 
    });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, category, description, price, unit, coverage, isActive } = req.body;

    const updateData = {
      name,
      brand,
      category,
      description,
      price: parseFloat(price),
      unit,
      coverage: parseFloat(coverage),
      isActive,
      updatedAt: new Date()
    };

    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy sản phẩm' 
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi cập nhật sản phẩm' 
    });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy sản phẩm' 
      });
    }

    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi xóa sản phẩm' 
    });
  }
});

// Orders endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const orders = await db.collection('orders').find({}).skip(skip).limit(limit).toArray();
    const total = await db.collection('orders').countDocuments();

    res.json({
      orders,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy danh sách đơn hàng' 
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
        error: 'Trạng thái không được để trống' 
      });
    }

    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Không tìm thấy đơn hàng' 
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi cập nhật trạng thái đơn hàng' 
    });
  }
});

// Users endpoints
app.get('/api/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await db.collection('users').find({}).skip(skip).limit(limit).toArray();
    const total = await db.collection('users').countDocuments();

    res.json({
      users,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy danh sách người dùng' 
    });
  }
});

// Suppliers endpoints
app.get('/api/suppliers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const suppliers = await db.collection('suppliers').find({}).skip(skip).limit(limit).toArray();
    const total = await db.collection('suppliers').countDocuments();

    res.json({
      suppliers,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy danh sách nhà cung cấp' 
    });
  }
});

// Reviews endpoints
app.get('/api/reviews', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const reviews = await db.collection('reviews').find({}).skip(skip).limit(limit).toArray();
    const total = await db.collection('reviews').countDocuments();

    res.json({
      reviews,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy danh sách đánh giá' 
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
      totalRevenue: 0 // TODO: Calculate from orders
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi khi lấy thống kê dashboard' 
    });
  }
});

// Start server
async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
