// Calculate final total with shipping
import { CartItem } from './types';
import { calculateTotalPrice } from './calculateTotalPrice';
import { calculateShippingCost } from './calculateShippingCost';

export function calculateFinalTotal(items: CartItem[]): number {
  const subtotal = calculateTotalPrice(items);
  const shipping = calculateShippingCost(subtotal);
  return subtotal + shipping;
}
