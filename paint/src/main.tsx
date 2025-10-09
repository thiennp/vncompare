import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { action as loginAction } from './routes/api.login';
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
import './index.css';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/api/login', action: loginAction },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage />, loader: adminDashboardLoader },
      { path: 'products', element: <AdminProductsPage />, loader: adminProductsLoader },
      { path: 'orders', element: <AdminOrdersPage />, loader: adminOrdersLoader },
      { path: 'users', element: <AdminUsersPage />, loader: adminUsersLoader },
      { path: 'suppliers', element: <AdminSuppliersPage />, loader: adminSuppliersLoader },
      { path: 'reviews', element: <AdminReviewsPage />, loader: adminReviewsLoader },
    ],
  },
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
