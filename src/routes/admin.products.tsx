import AdminProductsPage from '../features/admin/pages/AdminProductsPage';
import { adminProductsLoader } from '../features/admin/pages/loaders/adminProductsLoader';

export const loader = adminProductsLoader;

export default function AdminProducts() {
  return <AdminProductsPage />;
}
