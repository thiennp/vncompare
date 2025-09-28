import DashboardPage from '../features/dashboard/pages/DashboardPage';
import { dashboardLoader } from '../features/dashboard/loaders/dashboardLoader';

export const loader = dashboardLoader;

export default function Dashboard() {
  return <DashboardPage />;
}
