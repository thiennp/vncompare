// Get item by product ID
import { CartItem } from './types';

export function getItemByProductId(items: CartItem[], productId: string): CartItem | null {
  return items.find(item => item.product._id === productId) || null;
}
