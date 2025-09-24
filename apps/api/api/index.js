const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  credentials: false
}));

app.use(express.json());

// Mock data
const mockDashboardData = {
  totalRevenue: 125000,
  totalOrders: 342,
  activeProducts: 156,
  serviceAreas: 24,
  newCustomers: 89,
  productsSold: 1247,
  revenueChange: 12.5,
  ordersChange: 8.3,
  productsChange: 15.2,
  areasChange: 4.1,
  customersChange: 22.7
};

// TODO: Connect to real database instead of mock data
const mockProducts = [];

const mockOrders = [
  {
    id: '1',
    customerName: 'Nguyen Van A',
    customerEmail: 'nguyenvana@email.com',
    customerPhone: '+84901234567',
    products: [
      {
        productId: '1',
        productName: 'Dulux Weathershield',
        quantity: 2,
        unitPrice: 400000,
        totalPrice: 800000
      }
    ],
    totalAmount: 800000,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      id: '1',
      street: '123 Le Loi Street',
      ward: 'Ben Nghe',
      district: 'District 1',
      province: 'Ho Chi Minh City',
      postalCode: '700000',
      isServiceArea: true,
      deliveryFee: 50000,
      estimatedDays: 3,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    estimatedDelivery: '2024-01-18T10:00:00Z'
  }
];

// API Routes
app.get('/api/v1/analytics/dashboard', (req, res) => {
  res.json({
    success: true,
    data: mockDashboardData,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    }
  });
});

app.get('/api/v1/products', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  
  res.json({
    success: true,
    data: {
      products: mockProducts.slice(startIndex, endIndex),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: mockProducts.length,
        totalPages: Math.ceil(mockProducts.length / limit)
      },
      filters: {
        categories: [],
        brands: [],
        priceRange: {
          min: 0,
          max: 0
        }
      }
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    }
  });
});

app.get('/api/v1/analytics/top-products', (req, res) => {
  const { limit = 10 } = req.query;
  
  res.json({
    success: true,
    data: mockProducts.slice(0, parseInt(limit)),
    meta: {
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    }
  });
});

app.get('/api/v1/orders', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  
  res.json({
    success: true,
    data: {
      data: mockOrders.slice(startIndex, endIndex),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: mockOrders.length,
        totalPages: Math.ceil(mockOrders.length / limit)
      }
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'VNCompare API', 
    version: '1.0.0',
    endpoints: [
      'GET /api/v1/analytics/dashboard',
      'GET /api/v1/products',
      'GET /api/v1/analytics/top-products',
      'GET /api/v1/orders',
      'GET /api/health'
    ]
  });
});

module.exports = app;
