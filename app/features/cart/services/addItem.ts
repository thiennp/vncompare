// Add item to cart
import { CartItem } from './types';
import { Product } from '../../shared/types';

export function addItem(items: CartItem[], product: Product, quantity: number = 1): CartItem[] {
  const existingItem = items.find(item => item.product._id === product._id);
  
  if (existingItem) {
    return items.map(item =>
      item.product._id === product._id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }
  
  return [
    ...items,
    {
      id: `${product._id}-${Date.now()}`,
      product,
      quantity,
      price: product.price,
    },
  ];
}
