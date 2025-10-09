import type { CreateOrder } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import {
  isArrayWithEachItem,
  isNumber,
  isOneOf,
  isString,
  isType,
} from 'guardz';
import { isOrderItem } from './isOrderItem.guardz';

export function isCreateOrder(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is CreateOrder {
  return isType<CreateOrder>({
    userId: isString,
    items: isArrayWithEachItem(isOrderItem),
    totalAmount: isNumber,
    status: isOneOf<
      | 'cancelled'
      | 'delivered'
      | 'pending'
      | 'processing'
      | 'refunded'
      | 'shipped'
    >('cancelled', 'delivered', 'pending', 'processing', 'refunded', 'shipped'),
    paymentStatus: isOneOf<'failed' | 'paid' | 'pending' | 'refunded'>(
      'failed',
      'paid',
      'pending',
      'refunded'
    ),
    shippingAddress: isString,
  })(value, config);
}
