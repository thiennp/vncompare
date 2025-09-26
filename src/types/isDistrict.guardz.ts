import type { District } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isString, isType, isUndefinedOr } from 'guardz';

export function isDistrict(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is District {
  return isType<District>({
    _id: isUndefinedOr(isString),
    name: isString,
    code: isString,
    provinceId: isString,
    createdAt: isString,
  })(value, config);
}
