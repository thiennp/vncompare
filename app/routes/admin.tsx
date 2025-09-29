/* eslint-disable react-refresh/only-export-components */
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import { adminDashboardLoader } from '../features/admin/pages/loaders/adminDashboardLoader';
import { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  return adminDashboardLoader({ request });
}

export default AdminDashboardPage;
