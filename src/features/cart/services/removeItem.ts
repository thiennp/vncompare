// Remove item from cart
import { CartItem } from './types';

export function removeItem(items: CartItem[], itemId: string): CartItem[] {
  return items.filter(item => item.id !== itemId);
}
