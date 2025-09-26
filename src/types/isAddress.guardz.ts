import type { Address } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isBoolean, isDate, isString, isType, isUndefinedOr } from 'guardz';

export function isAddress(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is Address {
  return isType<Address>({
    _id: isUndefinedOr(isString),
    userId: isString,
    name: isString,
    phone: isString,
    address: isString,
    city: isString,
    district: isString,
    ward: isString,
    isDefault: isUndefinedOr(isBoolean),
    createdAt: isDate,
  })(value, config);
}
