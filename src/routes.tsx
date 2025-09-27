import { createBrowserRouter, createMemoryRouter } from 'react-router-dom';
import Root from './Root';
import Layout from './features/shared/components/Layout';
import HomePage from './features/home/pages/HomePage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ErrorPage from './features/error/pages/ErrorPage';
import ProductsPage from './features/products/pages/ProductsPage';
import ProductDetailPage from './features/products/pages/ProductDetailPage';
import CoverageCalculatorPage from './features/products/pages/CoverageCalculatorPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ProfilePage from './features/auth/pages/ProfilePage';
import OrdersPage from './features/orders/pages/OrdersPage';
import OrderDetailPage from './features/orders/pages/OrderDetailPage';
import ShippingCalculatorPage from './features/orders/pages/ShippingCalculatorPage';
import AdminLayout from './features/admin/components/AdminLayout';
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage';
import AdminProductsPage from './features/admin/pages/AdminProductsPage';
import AdminOrdersPage from './features/admin/pages/AdminOrdersPage';
import AdminUsersPage from './features/admin/pages/AdminUsersPage';
import AdminSuppliersPage from './features/admin/pages/AdminSuppliersPage';
import AdminReviewsPage from './features/admin/pages/AdminReviewsPage';

// Loaders
import { homeLoader } from './features/home/loaders/homeLoader';
import { dashboardLoader } from './features/dashboard/loaders/dashboardLoader';
import { productsLoader } from './features/products/pages/loaders/productsLoader';
import { productDetailLoader } from './features/products/pages/loaders/productDetailLoader';
import { profileLoader } from './features/auth/loaders/profileLoader';
import { ordersLoader } from './features/orders/pages/loaders/ordersLoader';
import { orderDetailLoader } from './features/orders/pages/loaders/orderDetailLoader';
import { shippingCalculatorLoader } from './features/orders/pages/loaders/shippingCalculatorLoader';
import { adminDashboardLoader } from './features/admin/pages/loaders/adminDashboardLoader';
import { adminProductsLoader } from './features/admin/pages/loaders/adminProductsLoader';
import { adminOrdersLoader } from './features/admin/pages/loaders/adminOrdersLoader';
import { adminUsersLoader } from './features/admin/pages/loaders/adminUsersLoader';
import { adminSuppliersLoader } from './features/admin/pages/loaders/adminSuppliersLoader';
import { adminReviewsLoader } from './features/admin/pages/loaders/adminReviewsLoader';
import { verifyAdmin } from './features/auth/loaders/verifyAuthLoader';

// Routes configuration for SSR
const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <HomePage />,
            loader: homeLoader,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
            loader: dashboardLoader,
          },
          {
            path: 'products',
            element: <ProductsPage />,
            loader: productsLoader,
          },
          {
            path: 'products/:id',
            element: <ProductDetailPage />,
            loader: productDetailLoader,
          },
          {
            path: 'coverage-calculator',
            element: <CoverageCalculatorPage />,
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
            path: 'profile',
            element: <ProfilePage />,
            loader: profileLoader,
          },
          {
            path: 'orders',
            element: <OrdersPage />,
            loader: ordersLoader,
          },
          {
            path: 'orders/:id',
            element: <OrderDetailPage />,
            loader: orderDetailLoader,
          },
          {
            path: 'shipping-calculator',
            element: <ShippingCalculatorPage />,
            loader: shippingCalculatorLoader,
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    loader: verifyAdmin,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
        loader: adminDashboardLoader,
      },
      {
        path: 'products',
        element: <AdminProductsPage />,
        loader: adminProductsLoader,
      },
      {
        path: 'orders',
        element: <AdminOrdersPage />,
        loader: adminOrdersLoader,
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
        loader: adminUsersLoader,
      },
      {
        path: 'suppliers',
        element: <AdminSuppliersPage />,
        loader: adminSuppliersLoader,
      },
      {
        path: 'reviews',
        element: <AdminReviewsPage />,
        loader: adminReviewsLoader,
      },
    ],
  },
];

// Client-side router
export function createClientRouter() {
  return createBrowserRouter(routes);
}

// Server-side router
export function createSSRRouter(url: string) {
  return createMemoryRouter(routes, {
    initialEntries: [url],
  });
}
