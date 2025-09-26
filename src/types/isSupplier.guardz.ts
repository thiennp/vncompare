import type { Supplier } from './index';
import type { TypeGuardFnConfig } from 'guardz';
import { isBoolean, isDate, isString, isType, isUndefinedOr } from 'guardz';

export function isSupplier(
  value: unknown,
  config?: TypeGuardFnConfig | null
): value is Supplier {
  return isType<Supplier>({
    _id: isUndefinedOr(isString),
    name: isString,
    email: isString,
    phone: isString,
    address: isString,
    isVerified: isUndefinedOr(isBoolean),
    createdAt: isDate,
    isActive: isUndefinedOr(isBoolean),
  })(value, config);
}
