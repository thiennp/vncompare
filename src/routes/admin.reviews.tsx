import AdminReviewsPage from '../features/admin/pages/AdminReviewsPage';
import { adminReviewsLoader } from '../features/admin/pages/loaders/adminReviewsLoader';

export const loader = adminReviewsLoader;

export default function AdminReviews() {
  return <AdminReviewsPage />;
}
