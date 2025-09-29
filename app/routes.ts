import {
  index,
  route,
  layout,
  type RouteConfig,
} from '@react-router/dev/routes';

export default [
  // Layout wrapper for all main pages
  layout('./routes/_layout.tsx', [
    // Main pages
    index('./features/home/pages/HomePage.tsx'),
    route('/dashboard', './features/dashboard/pages/DashboardPage.tsx'),
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
    route('/admin/products/new', './routes/admin.products.new.tsx'),
    route('/admin/products/:id/edit', './routes/admin.products.$id.edit.tsx'),
    route('/admin/orders', './routes/admin.orders.tsx'),
    route('/admin/users', './routes/admin.users.tsx'),
    route('/admin/suppliers', './routes/admin.suppliers.tsx'),
    route('/admin/suppliers/new', './routes/admin.suppliers.new.tsx'),
    route('/admin/suppliers/:id/edit', './routes/admin.suppliers.$id.edit.tsx'),
    route('/admin/reviews', './routes/admin.reviews.tsx'),
  ]),

  // API Routes (outside layout)
  route('/api/verify', './features/auth/services/verify.server.ts'),
  route('/api/logout', './api/logout.server.ts'),
  route('/api/register', './api/register.server.ts'),
  route('/api/product-detail/:id', './api/product-detail.server.ts'),
  route('/api/orders/:id', './api/orders.server.ts'),

  // 404 page
  route('*', './routes/404.tsx'),
] satisfies RouteConfig;
