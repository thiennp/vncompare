import OrderDetailPage from '../features/orders/pages/OrderDetailPage';
import { orderDetailLoader } from '../features/orders/pages/loaders/orderDetailLoader';

export const loader = orderDetailLoader;

export default function OrderDetail() {
  return <OrderDetailPage />;
}
