import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 3001;

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
        email: 'nguyenphongthien@gmail.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://vncompare-api.railway.app' 
          : `http://localhost:${PORT}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
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
            updatedAt: { type: 'string', format: 'date-time' }
          }
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
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            products: { type: 'array' },
            total: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
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
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./server-deploy.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'VNCompare API Documentation'
}));

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
 *                 documentation:
 *                   type: string
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
      'GET /api/dashboard/stats'
    ],
    documentation: '/api-docs'
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
    environment: process.env.NODE_ENV || 'development'
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
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email và mật khẩu là bắt buộc',
    });
  }

  // Mock login for demo purposes
  if (email === 'nguyenphongthien@gmail.com' && password === 'Kimtuoc2') {
    return res.json({
      success: true,
      user: {
        email: 'nguyenphongthien@gmail.com',
        name: 'Nguyen Phong Thien',
        role: 'admin',
      },
      token: 'mock-jwt-token-for-demo',
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Email hoặc mật khẩu không đúng',
  });
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
 */
app.get('/api/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  // Mock data for demo
  const mockUsers = [
    {
      _id: '1',
      email: 'nguyenphongthien@gmail.com',
      name: 'Nguyen Phong Thien',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      email: 'user@example.com',
      name: 'Test User',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  res.json({
    users: mockUsers,
    total: mockUsers.length,
    page,
    limit,
  });
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
 */
app.get('/api/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  // Mock data for demo
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
      updatedAt: new Date().toISOString()
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
      updatedAt: new Date().toISOString()
    }
  ];

  res.json({
    products: mockProducts,
    total: mockProducts.length,
    page,
    limit,
  });
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
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    totalUsers: 2,
    totalProducts: 2,
    totalOrders: 0,
    totalSuppliers: 0,
    totalRevenue: 0,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
