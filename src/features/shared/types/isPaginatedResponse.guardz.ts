import type { PaginatedResponse } from './index';
import type { TypeGuardFn, TypeGuardFnConfig } from 'guardz';
import { isArrayWithEachItem, isNumber, isType } from 'guardz';

export function isPaginatedResponse<T = unknown>(
  typeGuardT: TypeGuardFn<T>
): (
  value: unknown,
  config?: TypeGuardFnConfig | null
) => value is PaginatedResponse<T> {
  return (
    value: unknown,
    config?: TypeGuardFnConfig | null
  ): value is PaginatedResponse<T> => {
    return isType<PaginatedResponse<T>>({
      items: isArrayWithEachItem(typeGuardT),
      total: isNumber,
      page: isNumber,
      limit: isNumber,
      totalPages: isNumber,
    })(value, config);
  };
}
