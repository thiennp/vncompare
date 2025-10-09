import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { action as loginAction } from './routes/api.login';
import AdminLayout from './features/admin/components/AdminLayout';
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage';
import AdminProductsPage from './features/admin/pages/AdminProductsPage';
import AdminOrdersPage from './features/admin/pages/AdminOrdersPage';
import AdminUsersPage from './features/admin/pages/AdminUsersPage';
import AdminSuppliersPage from './features/admin/pages/AdminSuppliersPage';
import AdminReviewsPage from './features/admin/pages/AdminReviewsPage';
import './index.css';

const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/api/login', action: loginAction },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'suppliers', element: <AdminSuppliersPage /> },
      { path: 'reviews', element: <AdminReviewsPage /> },
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
