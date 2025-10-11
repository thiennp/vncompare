import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vncompare';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'VNCompare API Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: [
      'GET /api/health',
      'GET /api/users',
      'POST /api/users',
      'POST /api/login'
    ]
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  let client;
  try {
    // Ensure database connection for serverless environment
    if (!db) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db('vncompare');
    }

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
  } finally {
    // Close connection in serverless environment
    if (client) {
      await client.close();
    }
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

// Export for Vercel
export default app;

// Start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}
