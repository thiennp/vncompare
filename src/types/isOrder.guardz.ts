import type { Order } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import {
  isArrayWithEachItem,
  isDate,
  isNumber,
  isOneOf,
  isString,
  isType,
  isUndefinedOr,
} from 'guardz';
import { isOrderItem } from './isOrderItem.guardz';

export function isOrder(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is Order {
  return isType<Order>({
    _id: isUndefinedOr(isString),
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
    createdAt: isDate,
    updatedAt: isUndefinedOr(isDate),
  })(value, config);
}
