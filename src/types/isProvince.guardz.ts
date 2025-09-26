import type { Province } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isString, isType, isUndefinedOr } from 'guardz';

export function isProvince(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is Province {
  return isType<Province>({
    _id: isUndefinedOr(isString),
    name: isString,
    code: isString,
    createdAt: isString
  })(value, config);
}
