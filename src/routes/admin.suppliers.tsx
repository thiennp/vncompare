import AdminSuppliersPage from '../features/admin/pages/AdminSuppliersPage';
import { adminSuppliersLoader } from '../features/admin/pages/loaders/adminSuppliersLoader';

export const loader = adminSuppliersLoader;

export default function AdminSuppliers() {
  return <AdminSuppliersPage />;
}
