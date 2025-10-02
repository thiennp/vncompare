import type { ApiResponse } from './index';
import type { TypeGuardFn, TypeGuardFnConfig } from 'guardz';
import { isBoolean, isString, isType, isUndefinedOr } from 'guardz';

export function isApiResponse<T = unknown>(
  typeGuardT: TypeGuardFn<T>
): (
  value: unknown,
  config?: TypeGuardFnConfig | null
) => value is ApiResponse<T> {
  return (
    value: unknown,
    config?: TypeGuardFnConfig | null
  ): value is ApiResponse<T> => {
    return isType<ApiResponse<T>>({
      success: isBoolean,
      message: isUndefinedOr(isString),
      data: isUndefinedOr(typeGuardT),
      error: isUndefinedOr(isString),
    })(value, config);
  };
}
