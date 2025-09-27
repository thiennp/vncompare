import type { Plugin } from 'vite';
import { getHomePageData } from './src/api/home';
import { getDashboardData } from './src/api/dashboard';
import { getProductsData } from './src/api/products';
import { getProductDetailData } from './src/api/product-detail';
import { getOrdersData, getOrderDetailData } from './src/api/orders';
import {
  getAdminDashboardData,
  getAdminProductsData,
  getAdminOrdersData,
  getAdminUsersData,
  getAdminSuppliersData,
  getAdminReviewsData,
} from './src/api/admin';
import { MongoClient } from 'mongodb';
import { comparePassword } from './src/features/auth/services/comparePassword';
import { createJWT } from './src/features/auth/services/createJWT';

const MONGODB_URI = 'mongodb://localhost:27017/vncompare';

export function apiPlugin(): Plugin {
  return {
    name: 'api-plugin',
    configureServer(server) {
      // Login API
      server.middlewares.use('/api/login', async (req, res, next) => {
        if (req.method === 'POST') {
          try {
            // Convert Node.js request to Web API Request
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });

            await new Promise(resolve => {
              req.on('end', resolve);
            });

            const formData = new URLSearchParams(body);
            const email = formData.get('email');
            const password = formData.get('password');

            if (!email || !password) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Email và mật khẩu là bắt buộc',
                })
              );
              return;
            }

            const client = new MongoClient(MONGODB_URI);
            await client.connect();
            const db = client.db('vncompare');

            // Find user
            const user = await db.collection('users').findOne({ email });
            if (!user) {
              await client.close();
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Email hoặc mật khẩu không đúng',
                })
              );
              return;
            }

            // Check password
            const isValidPassword = await comparePassword(
              password,
              user.password
            );
            if (!isValidPassword) {
              await client.close();
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Email hoặc mật khẩu không đúng',
                })
              );
              return;
            }

            // Create JWT token
            const token = createJWT({
              userId: user._id,
              email: user.email,
              role: user.role,
            });

            await client.close();

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader(
              'Set-Cookie',
              `auth_token=${token}; path=/; max-age=86400; secure; samesite=strict`
            );
            res.end(
              JSON.stringify({
                success: true,
                user: {
                  _id: user._id,
                  email: user.email,
                  name: user.name,
                  role: user.role,
                },
                token,
              })
            );
          } catch (error) {
            console.error('Login API Error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({ success: false, error: 'Đăng nhập thất bại' })
            );
          }
        } else {
          next();
        }
      });

      // Home API
      server.middlewares.use('/api/home', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const data = await getHomePageData();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });

      // Dashboard API
      server.middlewares.use('/api/dashboard', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const data = await getDashboardData();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });

      // Product Detail API (separate endpoint)
      server.middlewares.use('/api/product-detail/', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const productId = req.url?.split('/').pop();
            if (!productId) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Product ID required' }));
              return;
            }

            const data = await getProductDetailData(productId);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });

      // Products API (list only)
      server.middlewares.use('/api/products', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const url = new URL(req.url!, `http://${req.headers.host}`);
            const search = url.searchParams.get('search') || '';
            const category = url.searchParams.get('category') || '';
            const page = parseInt(url.searchParams.get('page') || '1');

            const data = await getProductsData(search, category, page);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });

      // Orders API
      server.middlewares.use('/api/orders', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const url = new URL(req.url!, `http://${req.headers.host}`);
            const status = url.searchParams.get('status') || '';
            const page = parseInt(url.searchParams.get('page') || '1');

            const data = await getOrdersData(status, page);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });

      // Order Detail API
      server.middlewares.use('/api/orders/:id', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const orderId = req.url?.split('/').pop();
            if (!orderId) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Order ID required' }));
              return;
            }

            const data = await getOrderDetailData(orderId);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });

      // Admin APIs
      server.middlewares.use('/api/admin/dashboard', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const data = await getAdminDashboardData();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });

      server.middlewares.use('/api/admin/products', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const url = new URL(req.url!, `http://${req.headers.host}`);
            const page = parseInt(url.searchParams.get('page') || '1');

            const data = await getAdminProductsData(page);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });

      server.middlewares.use('/api/admin/orders', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const url = new URL(req.url!, `http://${req.headers.host}`);
            const page = parseInt(url.searchParams.get('page') || '1');

            const data = await getAdminOrdersData(page);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });

      server.middlewares.use('/api/admin/users', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const url = new URL(req.url!, `http://${req.headers.host}`);
            const page = parseInt(url.searchParams.get('page') || '1');

            const data = await getAdminUsersData(page);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });

      server.middlewares.use('/api/admin/suppliers', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const url = new URL(req.url!, `http://${req.headers.host}`);
            const page = parseInt(url.searchParams.get('page') || '1');

            const data = await getAdminSuppliersData(page);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });

      server.middlewares.use('/api/admin/reviews', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const url = new URL(req.url!, `http://${req.headers.host}`);
            const page = parseInt(url.searchParams.get('page') || '1');

            const data = await getAdminReviewsData(page);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });
    },
  };
}
