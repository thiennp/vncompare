import type { PaymentStatus } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isOneOf } from 'guardz';

export function isPaymentStatus(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is PaymentStatus {
  return isOneOf<'failed' | 'paid' | 'pending' | 'refunded'>(
    'failed',
    'paid',
    'pending',
    'refunded'
  )(value, config);
}
