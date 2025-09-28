import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  // Main pages
  index('./features/home/pages/HomePage.tsx'),
  route('/dashboard', './routes/dashboard.tsx'),
  route('/products', './routes/products.tsx'),
  route('/products/:id', './routes/products.$id.tsx'),
  route('/coverage-calculator', './routes/coverage-calculator.tsx'),
  route('/orders', './routes/orders.tsx'),
  route('/orders/:id', './routes/orders.$id.tsx'),
  route('/shipping-calculator', './routes/shipping-calculator.tsx'),
  
  // Auth pages
  route('/login', './routes/login.tsx'),
  route('/register', './routes/register.tsx'),
  route('/profile', './routes/profile.tsx'),
  
  // Admin pages
  route('/admin', './routes/admin.tsx'),
  route('/admin/products', './routes/admin.products.tsx'),
  route('/admin/orders', './routes/admin.orders.tsx'),
  route('/admin/users', './routes/admin.users.tsx'),
  route('/admin/suppliers', './routes/admin.suppliers.tsx'),
  route('/admin/reviews', './routes/admin.reviews.tsx'),

  // API Routes
  route('/api/login', './api/login.server.ts'),
  route('/api/verify', './api/verify.server.ts'),
  route('/api/logout', './api/logout.server.ts'),
  route('/api/register', './api/register.server.ts'),
  route('/api/product-detail/:id', './api/product-detail.server.ts'),
  route('/api/orders/:id', './api/orders.server.ts'),
  
  // 404 page
  route('*', './routes/404.tsx'),
] satisfies RouteConfig;