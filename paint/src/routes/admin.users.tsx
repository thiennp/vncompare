import AdminUsersPage from '../features/admin/pages/AdminUsersPage';
import { adminUsersLoader } from '../features/admin/pages/loaders/adminUsersLoader';

export const loader = adminUsersLoader;

export default function AdminUsers() {
  return <AdminUsersPage />;
}
