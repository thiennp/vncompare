import type { CreateReview } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isNumber, isString, isType } from 'guardz';

export function isCreateReview(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is CreateReview {
  return isType<CreateReview>({
    productId: isString,
    userId: isString,
    rating: isNumber,
    title: isString,
    comment: isString,
  })(value, config);
}
