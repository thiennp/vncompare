import type { Review } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isNumber, isOneOf, isString, isType, isUndefinedOr } from 'guardz';

export function isReview(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is Review {
  return isType<Review>({
    _id: isUndefinedOr(isString),
    productId: isString,
    userId: isString,
    rating: isNumber,
    title: isString,
    comment: isString,
    status: isUndefinedOr(
      isOneOf<'approved' | 'pending' | 'rejected'>(
        'approved',
        'pending',
        'rejected'
      )
    ),
    createdAt: isString,
  })(value, config);
}
