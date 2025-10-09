import type { ReviewStatus } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isOneOf } from 'guardz';

export function isReviewStatus(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is ReviewStatus {
  return isOneOf<'approved' | 'pending' | 'rejected'>(
    'approved',
    'pending',
    'rejected'
  )(value, config);
}
