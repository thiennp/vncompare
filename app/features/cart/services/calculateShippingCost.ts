// Calculate shipping cost
export function calculateShippingCost(totalPrice: number): number {
  if (totalPrice >= 1000000) return 0; // Free shipping over 1M VND
  if (totalPrice >= 500000) return 30000; // 30k for orders over 500k
  return 50000; // 50k for smaller orders
}
