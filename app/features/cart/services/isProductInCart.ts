// Check if product is in cart
import { CartItem } from './types';

export function isProductInCart(items: CartItem[], productId: string): boolean {
  return items.some(item => item.product._id === productId);
}
