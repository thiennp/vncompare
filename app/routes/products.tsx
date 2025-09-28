import ProductsPage from '../features/products/pages/ProductsPage';
import { productsLoader } from '../features/products/pages/loaders/productsLoader';

export const loader = productsLoader;

export default function Products() {
  return <ProductsPage />;
}
