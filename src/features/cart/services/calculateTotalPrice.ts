// Calculate total price
import { CartItem } from './types';

export function calculateTotalPrice(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}
