import type { OrderItem } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isNumber, isString, isType } from 'guardz';

export function isOrderItem(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is OrderItem {
  return isType<OrderItem>({
    productId: isString,
    quantity: isNumber,
    price: isNumber,
    total: isNumber,
  })(value, config);
}
