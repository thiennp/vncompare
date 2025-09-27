// Update item quantity
import { CartItem } from './types';
import { removeItem } from './removeItem';

export function updateQuantity(items: CartItem[], itemId: string, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return removeItem(items, itemId);
  }
  
  return items.map(item =>
    item.id === itemId ? { ...item, quantity } : item
  );
}
