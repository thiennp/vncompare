import ShippingCalculatorPage from '../features/orders/pages/ShippingCalculatorPage';
import { shippingCalculatorLoader } from '../features/orders/pages/loaders/shippingCalculatorLoader';

export const loader = shippingCalculatorLoader;

export default function ShippingCalculator() {
  return <ShippingCalculatorPage />;
}
