import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AdminSuppliersPage from './pages/AdminSuppliersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import LoginPage from './pages/LoginPage';

const router = createBrowserRouter([
  { path: '/', element: React.createElement(AdminDashboardPage) },
  { path: '/login', element: React.createElement(LoginPage) },
  { path: '/products', element: React.createElement(AdminProductsPage) },
  { path: '/orders', element: React.createElement(AdminOrdersPage) },
  { path: '/reviews', element: React.createElement(AdminReviewsPage) },
  { path: '/suppliers', element: React.createElement(AdminSuppliersPage) },
  { path: '/users', element: React.createElement(AdminUsersPage) },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


