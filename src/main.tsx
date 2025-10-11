import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { action as loginAction } from './routes/api.login';
import HomePage from './features/home/pages/HomePage';
import AdminLayout from './features/admin/components/AdminLayout';
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage';
import AdminProductsPage from './features/admin/pages/AdminProductsPage';
import AdminOrdersPage from './features/admin/pages/AdminOrdersPage';
import AdminUsersPage from './features/admin/pages/AdminUsersPage';
import AdminSuppliersPage from './features/admin/pages/AdminSuppliersPage';
import AdminReviewsPage from './features/admin/pages/AdminReviewsPage';
import { adminProductsLoader } from './features/admin/pages/loaders/adminProductsLoader';
import { adminOrdersLoader } from './features/admin/pages/loaders/adminOrdersLoader';
import { adminUsersLoader } from './features/admin/pages/loaders/adminUsersLoader';
import { adminSuppliersLoader } from './features/admin/pages/loaders/adminSuppliersLoader';
import { adminReviewsLoader } from './features/admin/pages/loaders/adminReviewsLoader';
import { adminDashboardLoader } from './features/admin/pages/loaders/adminDashboardLoader';
import ErrorPage from './features/error/pages/ErrorPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ProfilePage from './features/auth/pages/ProfilePage';
import { profileLoader } from './features/auth/loaders/profileLoader';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import { dashboardLoader } from './features/dashboard/loaders/dashboardLoader';
import ProductsPage from './features/products/pages/ProductsPage';
import ProductDetailPage from './features/products/pages/ProductDetailPage';
import CoverageCalculatorPage from './features/products/pages/CoverageCalculatorPage';
import { productsLoader } from './features/products/pages/loaders/productsLoader';
import { productDetailLoader } from './features/products/pages/loaders/productDetailLoader';
import { coverageCalculatorLoader } from './features/products/pages/loaders/coverageCalculatorLoader';
import OrdersPage from './features/orders/pages/OrdersPage';
import OrderDetailPage from './features/orders/pages/OrderDetailPage';
import ShippingCalculatorPage from './features/orders/pages/ShippingCalculatorPage';
import { ordersLoader } from './features/orders/pages/loaders/ordersLoader';
import { orderDetailLoader } from './features/orders/pages/loaders/orderDetailLoader';
import { shippingCalculatorLoader } from './features/orders/pages/loaders/shippingCalculatorLoader';
import './index.css';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/profile', element: <ProfilePage />, loader: profileLoader },
  { path: '/dashboard', element: <DashboardPage />, loader: dashboardLoader },
  { path: '/products', element: <ProductsPage />, loader: productsLoader },
  {
    path: '/products/:id',
    element: <ProductDetailPage />,
    loader: productDetailLoader,
  },
  {
    path: '/coverage-calculator',
    element: <CoverageCalculatorPage />,
    loader: coverageCalculatorLoader,
  },
  { path: '/orders', element: <OrdersPage />, loader: ordersLoader },
  {
    path: '/orders/:id',
    element: <OrderDetailPage />,
    loader: orderDetailLoader,
  },
  {
    path: '/shipping-calculator',
    element: <ShippingCalculatorPage />,
    loader: shippingCalculatorLoader,
  },
  { path: '/api/login', action: loginAction },
  {
    path: '/admin',
    element: <AdminLayout />,
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
      { path: 'users', element: <AdminUsersPage />, loader: adminUsersLoader },
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
  { path: '*', element: <ErrorPage /> },
]);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
