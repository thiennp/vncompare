// Cart types
import { Product } from '../../shared/types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
