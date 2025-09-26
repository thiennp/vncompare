import type { Ward } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isString, isType, isUndefinedOr } from 'guardz';

export function isWard(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is Ward {
  return isType<Ward>({
    _id: isUndefinedOr(isString),
    name: isString,
    code: isString,
    districtId: isString,
    createdAt: isString,
  })(value, config);
}
