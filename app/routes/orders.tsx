import OrdersPage from '../features/orders/pages/OrdersPage';
import { ordersLoader } from '../features/orders/pages/loaders/ordersLoader';

export const loader = ordersLoader;

export default function Orders() {
  return <OrdersPage />;
}
