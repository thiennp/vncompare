import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://thiennp:Kimtuoc2%40@vncompare.blc3zwp.mongodb.net/vncompare?retryWrites=true&w=majority&appName=Vncompare';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            'https://vncompare.vercel.app',
            'https://www.vncompare.vercel.app',
            'https://vncompare.com',
            'https://www.vncompare.com',
          ]
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VNCompare API',
      version: '1.0.0',
      description: 'API documentation for VNCompare paint comparison platform',
      contact: {
        name: 'VNCompare Team',
        email: 'nguyenphongthien@gmail.com',
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://vncompare-api.railway.app'
            : `http://localhost:${PORT}`,
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production server'
            : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            brand: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            unit: { type: 'string' },
            coverage: { type: 'number' },
            isActive: { type: 'boolean' },
            images: { type: 'array', items: { type: 'string' } },
            specifications: { type: 'object' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            products: { type: 'array' },
            total: { type: 'number' },
            status: {
              type: 'string',
              enum: [
                'pending',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
              ],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Supplier: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
            verified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./server.js'], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'VNCompare API Documentation',
  })
);

// MongoDB connection
let db;
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('vncompare');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('Server will continue without database connection');
    // Don't throw error - allow server to start without MongoDB
  }
}

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Returns basic server information and available endpoints
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Server information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                 endpoints:
 *                   type: array
 *                   items:
 *                     type: string
 */
app.get('/', (req, res) => {
  res.json({
    message: 'VNCompare API Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: [
      'GET /api/health',
      'GET /api/users',
      'POST /api/users',
      'POST /api/login',
      'GET /api/products',
      'POST /api/products',
      'GET /api/orders',
      'GET /api/suppliers',
      'GET /api/dashboard/stats',
    ],
    documentation: '/api-docs',
  });
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Check if the server is running and healthy
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and return JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nguyenphongthien@gmail.com
 *               password:
 *                 type: string
 *                 example: Kimtuoc2
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
          _id: 'admin-user-id',
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
        _id: user._id.toString(),
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

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products
 *     description: Retrieve a paginated list of products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create product
 *     description: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - brand
 *               - price
 *               - coverage
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *                 default: Sơn ngoại thất
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               unit:
 *                 type: string
 *                 default: lít
 *               coverage:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

    // Fallback to mock data when database connection fails
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const mockProducts = [
      {
        _id: '1',
        name: 'Sơn Dulux Weathershield',
        brand: 'Dulux',
        category: 'Sơn ngoại thất',
        description: 'Sơn chống thấm cao cấp',
        price: 450000,
        unit: 'lít',
        coverage: 12,
        isActive: true,
        images: [],
        specifications: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        name: 'Sơn Jotun Majestic',
        brand: 'Jotun',
        category: 'Sơn ngoại thất',
        description: 'Sơn cao cấp chống UV',
        price: 520000,
        unit: 'lít',
        coverage: 10,
        isActive: true,
        images: [],
        specifications: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '3',
        name: 'Sơn Kova Premium',
        brand: 'Kova',
        category: 'Sơn nội thất',
        description: 'Sơn nội thất cao cấp',
        price: 380000,
        unit: 'lít',
        coverage: 15,
        isActive: true,
        images: [],
        specifications: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    res.json({
      products: mockProducts,
      total: mockProducts.length,
      page,
      limit,
    });
  }
});

app.post('/api/products', async (req, res) => {
  let client;
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

    // Ensure database connection for serverless environment
    if (!db) {
      console.log('Creating new MongoDB connection...');
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db('vncompare');
      console.log('MongoDB connected successfully');
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
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi tạo sản phẩm',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    // Close connection in serverless environment
    if (client) {
      await client.close();
    }
  }
});

app.put('/api/products/:id', async (req, res) => {
  let client;
  try {
    // Ensure database connection for serverless environment
    if (!db) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db('vncompare');
    }
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
  } finally {
    // Close connection in serverless environment
    if (client) {
      await client.close();
    }
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

    // Fallback to mock data when database connection fails
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const mockOrders = [
      {
        _id: '1',
        userId: '1',
        products: [
          {
            productId: '1',
            name: 'Sơn Dulux Weathershield',
            quantity: 2,
            price: 450000,
          },
        ],
        total: 900000,
        status: 'pending',
        shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        userId: '2',
        products: [
          {
            productId: '2',
            name: 'Sơn Jotun Majestic',
            quantity: 1,
            price: 520000,
          },
        ],
        total: 520000,
        status: 'processing',
        shippingAddress: '456 Đường XYZ, Quận 2, TP.HCM',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    res.json({
      orders: mockOrders,
      total: mockOrders.length,
      page,
      limit,
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

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get users
 *     description: Retrieve a paginated list of users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create user
 *     description: Create a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - missing required fields or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

    // Fallback to mock data when database connection fails
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const mockUsers = [
      {
        _id: '1',
        email: 'nguyenphongthien@gmail.com',
        name: 'Nguyen Phong Thien',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        email: 'user@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    res.json({
      users: mockUsers,
      total: mockUsers.length,
      page,
      limit,
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

    // Fallback to mock data when database connection fails
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const mockSuppliers = [
      {
        _id: '1',
        name: 'Công ty TNHH Sơn Dulux',
        email: 'contact@dulux.vn',
        phone: '028-1234-5678',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        name: 'Jotun Vietnam',
        email: 'info@jotun.vn',
        phone: '028-8765-4321',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    res.json({
      suppliers: mockSuppliers,
      total: mockSuppliers.length,
      page,
      limit,
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

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieve statistics for the admin dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 totalProducts:
 *                   type: integer
 *                 totalOrders:
 *                   type: integer
 *                 totalSuppliers:
 *                   type: integer
 *                 totalRevenue:
 *                   type: number
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  let client;
  try {
    // Ensure database connection for serverless environment
    if (!db) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db('vncompare');
    }

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
      activeProducts: 0, // TODO: Calculate active products
      verifiedSuppliers: 0, // TODO: Calculate verified suppliers
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    // Fallback to mock data when database connection fails
    res.json({
      totalUsers: 2,
      totalProducts: 3,
      totalOrders: 2,
      totalSuppliers: 2,
      totalRevenue: 1420000,
      activeProducts: 3,
      verifiedSuppliers: 2,
    });
  } finally {
    // Close connection in serverless environment
    if (client) {
      await client.close();
    }
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

// MongoDB connection diagnostic endpoint
app.get('/api/debug/mongodb', async (req, res) => {
  try {
    const hasUri = !!MONGODB_URI;
    const uriPreview = MONGODB_URI
      ? MONGODB_URI.substring(0, 20) +
        '...' +
        MONGODB_URI.substring(MONGODB_URI.length - 20)
      : 'NOT SET';

    if (!MONGODB_URI) {
      return res.json({
        status: 'error',
        message: 'MONGODB_URI environment variable is not set',
        hasUri,
      });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const adminDb = client.db().admin();
    const serverInfo = await adminDb.serverStatus();
    await client.close();

    res.json({
      status: 'success',
      message: 'MongoDB connection successful',
      hasUri,
      uriPreview,
      mongoVersion: serverInfo.version,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'MongoDB connection failed',
      error: error.message,
      hasUri: !!MONGODB_URI,
      timestamp: new Date().toISOString(),
    });
  }
});

// Reset database endpoint
app.post('/api/reset-db', async (req, res) => {
  try {
    // Only allow admin users to reset database
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Admin token required',
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Admin role required',
      });
    }

    // Drop all collections
    const collections = ['users', 'products', 'orders', 'suppliers', 'reviews'];
    for (const collectionName of collections) {
      await db
        .collection(collectionName)
        .drop()
        .catch(() => {
          // Collection might not exist, ignore error
        });
    }

    // Recreate collections with indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('products').createIndex({ name: 1 });
    await db.collection('orders').createIndex({ userId: 1 });
    await db
      .collection('suppliers')
      .createIndex({ email: 1 }, { unique: true });

    res.json({
      success: true,
      message: 'Database reset successfully',
    });
  } catch (error) {
    console.error('Reset database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset database',
    });
  }
});

// Initialize MongoDB connection
connectToDatabase().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// For Vercel serverless, export the app directly
export default app;

// For local development with Node.js
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => process.exit(0));
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => process.exit(0));
  });
}
