// Validate cart for checkout
import { CartItem } from './types';

export function validateCartForCheckout(items: CartItem[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (items.length === 0) {
    errors.push('Giỏ hàng trống');
  }
  
  items.forEach(item => {
    if (item.quantity <= 0) {
      errors.push(`Số lượng sản phẩm "${item.product.name}" không hợp lệ`);
    }
    if (item.price <= 0) {
      errors.push(`Giá sản phẩm "${item.product.name}" không hợp lệ`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
