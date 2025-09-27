import type { Plugin } from 'vite';
import { getHomePageData } from './src/api/home';
import { getDashboardData } from './src/api/dashboard';
import { getProductsData, getProductDetailData } from './src/api/products';
import { getOrdersData, getOrderDetailData } from './src/api/orders';
import {
  getAdminDashboardData,
  getAdminProductsData,
  getAdminOrdersData,
  getAdminUsersData,
  getAdminSuppliersData,
  getAdminReviewsData,
} from './src/api/admin';

export function apiPlugin(): Plugin {
  return {
    name: 'api-plugin',
    configureServer(server) {
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

      // Products API
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

      // Product Detail API
      server.middlewares.use('/api/products/:id', async (req, res, next) => {
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
