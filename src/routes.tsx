import { createBrowserRouter, createMemoryRouter } from 'react-router-dom';
import { db } from './features/shared';
import { AuthService } from './features/auth/services/auth.client';
import { Layout, HomePage, DashboardPage, ErrorPage } from './features/shared';
import { ProductsPage, ProductDetailPage, CoverageCalculatorPage } from './features/products';
import { LoginPage, RegisterPage, ProfilePage } from './features/auth';
import { OrdersPage, OrderDetailPage, ShippingCalculatorPage } from './features/orders';
import { AdminLayout, AdminDashboardPage, AdminProductsPage, AdminOrdersPage, AdminUsersPage, AdminSuppliersPage, AdminReviewsPage } from './features/admin';

// Helper function to verify authentication - using cookies
async function verifyAuth() {
  // Get token from cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  console.log('🔍 Auth check - Token exists:', !!token);
  console.log('🔍 Auth check - All cookies:', document.cookie);

  if (!token) {
    console.log('❌ No auth token found');
    throw new Response('Unauthorized', { status: 401 });
  }

  const authService = new AuthService();
  const result = await authService.verifyToken(token);
  console.log('🔍 Token verification result:', result.success);

  if (!result.success || !result.user) {
    console.log('❌ Token verification failed');
    // Remove invalid token cookie
    document.cookie =
      'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    throw new Response('Unauthorized', { status: 401 });
  }

  console.log('✅ Authentication successful for user:', result.user.email);
  return result.user;
}

// Helper function to verify admin role
async function verifyAdmin() {
  const user = await verifyAuth();
  if (user.role !== 'admin') {
    throw new Response('Forbidden', { status: 403 });
  }
  return user;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: async () => {
          const [productsResult, suppliersResult, reviewsResult] =
            await Promise.all([
              db.getProducts({ isActive: true }, 1, 8),
              db.getSuppliers({ isVerified: true }, 1, 6),
              db.getReviews({}, { status: 'approved' }, 1, 3),
            ]);

          return {
            featuredProducts: productsResult.products,
            suppliers: suppliersResult.suppliers,
            reviews: reviewsResult.reviews,
          };
        },
      },
      {
        path: 'products',
        element: <ProductsPage />,
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const page = parseInt(url.searchParams.get('page') || '1');
          const category = url.searchParams.get('category') || '';
          const search = url.searchParams.get('search') || '';

          const filters: Record<string, unknown> = { isActive: true };
          if (category) filters.category = category;
          if (search) {
            filters.$or = [
              { name: { $regex: search, $options: 'i' } },
              { brand: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
            ];
          }

          const productsResult = await db.getProducts(filters, page, 20);
          return {
            products: productsResult.products,
            total: productsResult.total,
            page,
            category,
            search,
          };
        },
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />,
        loader: async ({ params }) => {
          const product = await db.getProductById(params.id!);
          if (!product) {
            throw new Response('Product not found', { status: 404 });
          }

          const reviewsResult = await db.getReviews(
            { productId: params.id! },
            { status: 'approved' },
            1,
            10
          );

          return {
            product,
            reviews: reviewsResult.reviews,
            totalReviews: reviewsResult.total,
          };
        },
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
        loader: async () => {
          const user = await verifyAuth();
          const [ordersResult, addresses] = await Promise.all([
            db.getOrders({ userId: user._id!.toString() }, 1, 10),
            db.getAddresses({ userId: user._id!.toString() }),
          ]);

          return {
            user,
            recentOrders: ordersResult.orders,
            addresses,
          };
        },
      },
      {
        path: 'orders',
        element: <OrdersPage />,
        loader: async ({ request }) => {
          const user = await verifyAuth();
          const url = new URL(request.url);
          const page = parseInt(url.searchParams.get('page') || '1');
          const status = url.searchParams.get('status') || '';

          const filters: Record<string, unknown> = {};
          if (status) filters.status = status;

          const ordersResult = await db.getOrders(
            { userId: user._id!.toString(), ...filters },
            page,
            20
          );

          return {
            orders: ordersResult.orders,
            total: ordersResult.total,
            page,
            status,
          };
        },
      },
      {
        path: 'orders/:id',
        element: <OrderDetailPage />,
        loader: async ({ params }) => {
          const user = await verifyAuth();
          const order = await db.getOrderById(params.id!);

          if (!order) {
            throw new Response('Order not found', { status: 404 });
          }

          // Check if user owns this order or is admin
          if (
            order.userId.toString() !== user._id!.toString() &&
            user.role !== 'admin'
          ) {
            throw new Response('Forbidden', { status: 403 });
          }

          return { order, user };
        },
      },
      {
        path: 'profile',
        element: <ProfilePage />,
        loader: async () => {
          const user = await verifyAuth();
          const addresses = await db.getAddresses({ userId: user._id!.toString() });

          return { user, addresses };
        },
      },
      {
        path: 'coverage-calculator',
        element: <CoverageCalculatorPage />,
        loader: async () => {
          const productsResult = await db.getProducts(
            { isActive: true },
            1,
            100
          );
          return { products: productsResult.products };
        },
      },
      {
        path: 'shipping-calculator',
        element: <ShippingCalculatorPage />,
        loader: async () => {
          const [suppliersResult, provinces] = await Promise.all([
            db.getSuppliers({ isVerified: true }, 1, 100),
            db.getProvinces(),
          ]);

          return {
            suppliers: suppliersResult.suppliers,
            provinces,
          };
        },
      },
      // Admin routes
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
            loader: async () => {
              const _user = await verifyAdmin();
              const stats = await db.getDashboardStats();

              return { user: _user, stats };
            },
          },
          {
            path: 'products',
            element: <AdminProductsPage />,
            loader: async ({ request }) => {
              await verifyAdmin();
              const url = new URL(request.url);
              const page = parseInt(url.searchParams.get('page') || '1');
              const search = url.searchParams.get('search') || '';

              const filters: Record<string, unknown> = {};
              if (search) {
                filters.$or = [
                  { name: { $regex: search, $options: 'i' } },
                  { brand: { $regex: search, $options: 'i' } },
                ];
              }

              const productsResult = await db.getProducts(filters, page, 20);

              return {
                products: productsResult.products,
                total: productsResult.total,
                page,
                search,
              };
            },
          },
          {
            path: 'orders',
            element: <AdminOrdersPage />,
            loader: async ({ request }) => {
              await verifyAdmin();
              const url = new URL(request.url);
              const page = parseInt(url.searchParams.get('page') || '1');
              const status = url.searchParams.get('status') || '';

              const filters: Record<string, unknown> = {};
              if (status) filters.status = status;

              const ordersResult = await db.getOrders(
                filters,
                page,
                20
              );

              return {
                orders: ordersResult.orders,
                total: ordersResult.total,
                page,
                status,
              };
            },
          },
          {
            path: 'users',
            element: <AdminUsersPage />,
            loader: async ({ request }) => {
              await verifyAdmin();
              const url = new URL(request.url);
              const page = parseInt(url.searchParams.get('page') || '1');
              const role = url.searchParams.get('role') || '';

              const filters: Record<string, unknown> = {};
              if (role) filters.role = role;

              const usersResult = await db.getUsers(filters, page, 20);

              return {
                users: usersResult.users,
                total: usersResult.total,
                page,
                role,
              };
            },
          },
          {
            path: 'suppliers',
            element: <AdminSuppliersPage />,
            loader: async ({ request }) => {
              await verifyAdmin();
              const url = new URL(request.url);
              const page = parseInt(url.searchParams.get('page') || '1');
              const verified = url.searchParams.get('verified');

              const filters: Record<string, unknown> = {};
              if (verified !== null) filters.isVerified = verified === 'true';

              const suppliersResult = await db.getSuppliers(filters, page, 20);

              return {
                suppliers: suppliersResult.suppliers,
                total: suppliersResult.total,
                page,
                verified,
              };
            },
          },
          {
            path: 'reviews',
            element: <AdminReviewsPage />,
            loader: async ({ request }) => {
              await verifyAdmin();
              const url = new URL(request.url);
              const page = parseInt(url.searchParams.get('page') || '1');
              const status = url.searchParams.get('status') || '';

              const filters: Record<string, unknown> = {};
              if (status) filters.status = status;

              const reviewsResult = await db.getReviews(
                {},
                filters,
                page,
                20
              );

              return {
                reviews: reviewsResult.reviews,
                total: reviewsResult.total,
                page,
                status,
              };
            },
          },
        ],
      },
    ],
  },
]);
