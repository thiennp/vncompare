import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 3002;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vncompare';
let db;

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, isActive } = req.query;
    const skip = (page - 1) * limit;
    
    const filters = {};
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (category) filters.category = category;
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await db.collection('products').find(filters).skip(skip).limit(parseInt(limit)).toArray();
    const total = await db.collection('products').countDocuments(filters);
    
    res.json({ products, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await db.collection('products').findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/suppliers', async (req, res) => {
  try {
    const { page = 1, limit = 20, isVerified } = req.query;
    const skip = (page - 1) * limit;
    
    const filters = {};
    if (isVerified !== undefined) filters.isVerified = isVerified === 'true';

    const suppliers = await db.collection('suppliers').find(filters).skip(skip).limit(parseInt(limit)).toArray();
    const total = await db.collection('suppliers').countDocuments(filters);
    
    res.json({ suppliers, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 20, productId, status } = req.query;
    const skip = (page - 1) * limit;
    
    const filters = {};
    if (productId) filters.productId = productId;
    if (status) filters.status = status;

    const reviews = await db.collection('reviews').find(filters).skip(skip).limit(parseInt(limit)).toArray();
    const total = await db.collection('reviews').countDocuments(filters);
    
    res.json({ reviews, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const skip = (page - 1) * limit;
    
    const filters = {};
    if (role) filters.role = role;

    const users = await db.collection('users').find(filters).skip(skip).limit(parseInt(limit)).toArray();
    const total = await db.collection('users').countDocuments(filters);
    
    res.json({ users, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, userId } = req.query;
    const skip = (page - 1) * limit;
    
    const filters = {};
    if (userId) filters.userId = userId;

    const orders = await db.collection('orders').find(filters).skip(skip).limit(parseInt(limit)).toArray();
    const total = await db.collection('orders').countDocuments(filters);
    
    res.json({ orders, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/addresses', async (req, res) => {
  try {
    const { userId } = req.query;
    const filters = {};
    if (userId) filters.userId = userId;

    const addresses = await db.collection('addresses').find(filters).toArray();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, totalRevenue] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('products').countDocuments(),
      db.collection('orders').countDocuments(),
      db.collection('orders').aggregate([
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]).toArray()
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }
    
    // Simple password check (in production, use proper hashing)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'customer' } = req.body;
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Người dùng với email này đã tồn tại' });
    }
    
    const newUser = {
      email,
      password,
      name,
      role,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    const result = await db.collection('users').insertOne(newUser);
    const { password: _, ...userWithoutPassword } = { ...newUser, _id: result.insertedId };
    
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoints
app.post('/api/admin/products', async (req, res) => {
  try {
    const product = { ...req.body, createdAt: new Date().toISOString() };
    const result = await db.collection('products').insertOne(product);
    res.json({ ...product, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/products/:id', async (req, res) => {
  try {
    const result = await db.collection('products').updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    const result = await db.collection('products').deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/users', async (req, res) => {
  try {
    const user = { ...req.body, createdAt: new Date().toISOString() };
    const result = await db.collection('users').insertOne(user);
    res.json({ ...user, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const result = await db.collection('users').updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const result = await db.collection('users').deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/suppliers', async (req, res) => {
  try {
    const supplier = { ...req.body, createdAt: new Date().toISOString() };
    const result = await db.collection('suppliers').insertOne(supplier);
    res.json({ ...supplier, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/suppliers/:id', async (req, res) => {
  try {
    const result = await db.collection('suppliers').updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/suppliers/:id', async (req, res) => {
  try {
    const result = await db.collection('suppliers').deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
