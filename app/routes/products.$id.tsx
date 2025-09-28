import ProductDetailPage from '../features/products/pages/ProductDetailPage';
import { productDetailLoader } from '../features/products/pages/loaders/productDetailLoader';

export const loader = productDetailLoader;

export default function ProductDetail() {
  return <ProductDetailPage />;
}
