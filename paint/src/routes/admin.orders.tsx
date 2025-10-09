import AdminOrdersPage from '../features/admin/pages/AdminOrdersPage';
import { adminOrdersLoader } from '../features/admin/pages/loaders/adminOrdersLoader';

export const loader = adminOrdersLoader;

export default function AdminOrders() {
  return <AdminOrdersPage />;
}
