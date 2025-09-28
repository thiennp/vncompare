import type { OrderStatus } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isOneOf } from 'guardz';

export function isOrderStatus(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is OrderStatus {
  return isOneOf<
    | 'cancelled'
    | 'delivered'
    | 'pending'
    | 'processing'
    | 'refunded'
    | 'shipped'
  >(
    'cancelled',
    'delivered',
    'pending',
    'processing',
    'refunded',
    'shipped'
  )(value, config);
}
